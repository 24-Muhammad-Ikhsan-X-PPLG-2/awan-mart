<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('procurements', function (Blueprint $table): void {
            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'shipped',
                'completed',
            ])->change();
            $table->string('alasan_penolakan', 500)->nullable();
            $table->timestamp('tanggal_pengiriman')->nullable();
        });
    }

    public function down(): void
    {
        DB::table('procurements')
            ->where('status', 'rejected')
            ->update(['status' => 'pending']);
        DB::table('procurements')
            ->where('status', 'shipped')
            ->update(['status' => 'approved']);

        Schema::table('procurements', function (Blueprint $table): void {
            $table->dropColumn(['alasan_penolakan', 'tanggal_pengiriman']);
            $table->enum('status', ['pending', 'approved', 'completed'])->change();
        });
    }
};
