<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')
                ->unique()
                ->constrained('supplier')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->string('name', 100);
            $table->unsignedInteger('shipping_cost');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couriers');
    }
};
