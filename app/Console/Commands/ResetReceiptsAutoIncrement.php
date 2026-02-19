<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetReceiptsAutoIncrement extends Command
{
    protected $signature = 'receipts:reset-id
                            {--truncate : Hapus SEMUA data dan reset ID ke 1 (hati-hati!)}';

    protected $description = 'Reset auto-increment ID tabel receipts agar dimulai dari 1 setelah data dihapus';

    public function handle(): int
    {
        if ($this->option('truncate')) {
            if (!$this->confirm('⚠️  Ini akan MENGHAPUS SEMUA data receipts dan mereset ID ke 1. Lanjutkan?')) {
                $this->info('Dibatalkan.');
                return self::SUCCESS;
            }

            DB::statement('TRUNCATE TABLE receipts');
            $this->info('✅ Semua data receipts dihapus dan ID direset ke 1.');
            return self::SUCCESS;
        }

        // Hitung ID terbesar yang masih ada, lalu set AUTO_INCREMENT ke nilai berikutnya
        $maxId = DB::table('receipts')->max('id') ?? 0;
        $nextId = $maxId + 1;

        DB::statement("ALTER TABLE receipts AUTO_INCREMENT = {$nextId}");

        $this->info("✅ AUTO_INCREMENT receipts direset ke {$nextId} (berdasarkan ID terbesar yang ada: {$maxId}).");

        return self::SUCCESS;
    }
}
