<?php

use App\Http\Controllers\ReceiptController;
use Illuminate\Support\Facades\Route;

// Receipt API endpoints
// Public routes
Route::post('/receipts/webhook-callback', [ReceiptController::class, 'webhookCallback']);

