<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('courier_id')
                ->nullable()
                ->after('user_id')
                ->constrained('couriers')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->string('courier_name', 100)->nullable()->after('courier_id');
            $table->unsignedInteger('shipping_cost')->default(0)->after('total_price');
            $table->timestamp('shipped_at')->nullable()->after('status');
            $table->timestamp('completed_at')->nullable()->after('shipped_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['courier_id']);
            $table->dropColumn([
                'courier_id',
                'courier_name',
                'shipping_cost',
                'shipped_at',
                'completed_at',
            ]);
        });
    }
};
