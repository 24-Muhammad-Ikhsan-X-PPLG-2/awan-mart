<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained('orders')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->string('provider', 30)->default('midtrans');

            $table->string('provider_order_id', 50)->unique();

            $table->string('transaction_id')->nullable()->unique();

            $table->text('snap_token')->nullable();
            $table->text('redirect_url')->nullable();

            // Payment information
            $table->string('method', 50)->nullable();
            $table->decimal('amount', 12, 2);

            $table->enum('status', [
                'pending',
                'success',
                'failed',
                'expired',
                'canceled',
            ])->default('pending');

            $table->string('transaction_status', 50)->nullable();
            $table->string('fraud_status', 30)->nullable();

            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();

            $table->json('metadata')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
