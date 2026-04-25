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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_method')->nullable()->after('reviewed_at')->default('pickup');
            $table->decimal('delivery_fee', 8, 2)->nullable()->after('delivery_method')->default(0);
            $table->string('payment')->nullable()->after('delivery_fee')->default('cash');
            $table->foreignId('assigned_rider')->nullable()->after('payment')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['assigned_rider']);
            $table->dropColumn(['delivery_method', 'delivery_fee', 'payment', 'assigned_rider']);
        });
    }
};
