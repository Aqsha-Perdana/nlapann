<?php

use App\Http\Controllers\ReceiptController;
use Illuminate\Support\Facades\Route;

// Receipt API endpoints
Route::post('/receipts/upload', [ReceiptController::class, 'upload']);
Route::post('/receipts/webhook-callback', [ReceiptController::class, 'webhookCallback']);
Route::get('/receipts', [ReceiptController::class, 'index']);
Route::get('/receipts/{receipt}', [ReceiptController::class, 'show']);
