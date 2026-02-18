<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receipt extends Model
{
    protected $fillable = [
        'user_id',
        'image_path',
        'store_name',
        'receipt_date',
        'total_amount',
        'payment_method',
        'raw_ocr_text',
        'status',
        'is_duplicate',
        'duplicate_of',
        'content_hash',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'receipt_date' => 'date',
            'total_amount' => 'decimal:2',
            'is_duplicate' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function duplicateOf(): BelongsTo
    {
        return $this->belongsTo(Receipt::class, 'duplicate_of');
    }
}
