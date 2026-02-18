<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ReceiptController extends Controller
{
    /**
     * Upload receipt image, save to storage, and send to n8n webhook.
     */
    public function upload(Request $request): JsonResponse
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        'webhook_url' => 'nullable|url',
    ]);

    // Save image
    $path = $request->file('image')->store('receipts', 'public');

    // Create receipt record
    $receipt = Receipt::create([
        'user_id' => $request->user()?->id,
        'image_path' => $path,
        'status' => 'processing', // langsung processing
    ]);

    $webhookUrl = $request->input('webhook_url') ?: config('services.n8n.webhook_url');

    if (!$webhookUrl) {
        return response()->json([
            'success' => false,
            'message' => 'Webhook URL tidak ditemukan',
        ], 500);
    }

    try {
        $imageContent = Storage::disk('public')->get($path);

        $payload = [
            'receipt_id' => $receipt->id,
            'image_base64' => base64_encode($imageContent),
            'mime_type' => $request->file('image')->getMimeType(),
            'filename' => $request->file('image')->getClientOriginalName(),
            'callback_url' => url('/api/receipts/webhook-callback'),
        ];

        $response = Http::timeout(60)->post($webhookUrl, $payload);

        if (!$response->successful()) {
            $status = $response->status();
            $errorMessage = "Gagal memproses struk di n8n (Status: $status).";

            if ($status >= 400 && $status < 500) {
                $errorMessage = "Webhook n8n menolak request (Error $status). Cek konfigurasi webhook.";
            } elseif ($status >= 500) {
                $errorMessage = "Terjadi kesalahan internal di server n8n (Error $status). Cek log n8n.";
            }

            Log::error('n8n webhook failed', [
                'status' => $status,
                'body' => $response->body(),
            ]);

            $receipt->update([
                'status' => 'failed',
                'error_message' => $errorMessage
            ]);
        }

    } catch (\Exception $e) {
        $errorMessage = "Terjadi kesalahan sistem saat mengirim ke n8n.";
        
        // Check for connection/timeout errors
        if (str_contains(strtolower($e->getMessage()), 'curl') || str_contains(strtolower($e->getMessage()), 'timeout')) {
            $errorMessage = "Gagal menghubungi n8n (Timeout/Connection Error). Pastikan n8n berjalan dan URL webhook benar.";
        }

        Log::error('Failed sending to n8n', [
            'error' => $e->getMessage(),
        ]);

        $receipt->update([
            'status' => 'failed',
            'error_message' => $errorMessage
        ]);
    }

    return response()->json([
        'success' => true,
        'receipt' => $receipt->fresh(),
        'message' => 'Struk sedang diproses',
    ], 201);
}


    /**
     * Webhook callback endpoint for n8n to send parsed results.
     */
    public function webhookCallback(Request $request): JsonResponse
    {
        $request->validate([
            'receipt_id' => 'required|exists:receipts,id',
            'store_name' => 'nullable|string',
            'receipt_date' => 'nullable|date',
            'total_amount' => 'nullable|numeric',
            'payment_method' => 'nullable|string',
            'raw_text' => 'nullable|string',
        ]);

        $receipt = Receipt::findOrFail($request->input('receipt_id'));

        $this->processWebhookData($receipt, $request->all());

        return response()->json([
            'success' => true,
            'receipt' => $receipt->fresh(),
            'message' => 'Data struk berhasil diupdate',
        ]);
    }

    /**
     * List all receipts.
     */
    public function index(Request $request): JsonResponse
    {
        $receipts = Receipt::query()
            ->when($request->user(), fn ($q, $user) => $q->where('user_id', $user->id))
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'receipts' => $receipts,
        ]);
    }

    /**
     * Show a single receipt.
     */
    public function show(Receipt $receipt): JsonResponse
    {
        return response()->json([
            'receipt' => $receipt->load('duplicateOf'),
        ]);
    }

    /**
     * Process webhook data and check for duplicates.
     */
    private function processWebhookData(Receipt $receipt, array $data): void
    {
        $storeName = $data['store_name'] ?? null;
        $receiptDate = $data['receipt_date'] ?? null;
        $totalAmount = $data['total_amount'] ?? null;
        $paymentMethod = $data['payment_method'] ?? null;
        $rawText = $data['raw_text'] ?? $data['raw_ocr_text'] ?? null;

        // Generate content hash for duplicate detection
        $contentHash = null;
        if ($storeName && $receiptDate && $totalAmount) {
            $contentHash = md5(strtolower(trim($storeName)) . '|' . $receiptDate . '|' . number_format((float) $totalAmount, 2, '.', ''));
        }

        // Check for duplicates
        $isDuplicate = false;
        $duplicateOf = null;

        if ($contentHash) {
            $existingReceipt = Receipt::where('content_hash', $contentHash)
                ->where('id', '!=', $receipt->id)
                ->where('is_duplicate', false)
                ->first();

            if ($existingReceipt) {
                $isDuplicate = true;
                $duplicateOf = $existingReceipt->id;
            }
        }

        $receipt->update([
            'store_name' => $storeName,
            'receipt_date' => $receiptDate,
            'total_amount' => $totalAmount,
            'payment_method' => $paymentMethod,
            'raw_ocr_text' => $rawText,
            'content_hash' => $contentHash,
            'is_duplicate' => $isDuplicate,
            'duplicate_of' => $duplicateOf,
            'status' => $isDuplicate ? 'duplicate' : 'completed',
        ]);
    }
}
