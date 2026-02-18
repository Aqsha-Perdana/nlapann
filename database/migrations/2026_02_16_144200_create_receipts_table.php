<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('image_path');
            $table->string('store_name')->nullable();
            $table->date('receipt_date')->nullable();
            $table->decimal('total_amount', 15, 2)->nullable();
            $table->string('payment_method')->nullable();
            $table->longText('raw_ocr_text')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'duplicate'])->default('pending');
            $table->boolean('is_duplicate')->default(false);
            $table->foreignId('duplicate_of')->nullable()->constrained('receipts')->nullOnDelete();
            $table->string('content_hash')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
