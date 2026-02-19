<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('receipts', function () {
    return Inertia::render('receipts/index');
})->middleware(['auth'])->name('receipts.index');

// Receipt API routes (using web middleware for session auth)
use App\Http\Controllers\ReceiptController;
Route::middleware(['auth'])->prefix('api')->group(function () {
    Route::post('/receipts/upload', [ReceiptController::class, 'upload']);
    Route::get('/receipts', [ReceiptController::class, 'index']);
    Route::get('/receipts/{receipt}', [ReceiptController::class, 'show']);
    Route::put('/receipts/{receipt}', [ReceiptController::class, 'update']);
});

require __DIR__.'/settings.php';
