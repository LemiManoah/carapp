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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('brand', 100);
            $table->string('model', 255);
            $table->enum('body_type', ['MPV', 'SUV', 'Van', 'Sedan', 'Hatchback', 'Wagon', 'Coupe', 'Convertible']);
            $table->enum('car_type', ['Manual', 'Automatic']);
            $table->integer('year');
            $table->decimal('price', 12, 2);
            $table->integer('mileage')->nullable();
            $table->enum('fuel_type', ['Petrol', 'Diesel', 'Hybrid', 'Electric'])->nullable();
            $table->string('color', 50)->nullable();
            $table->timestamps();
            
            $table->index(['brand', 'model']);
            $table->index(['body_type', 'car_type']);
            $table->index('year');
            $table->index('price');

            $table->softDeletes();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('updated_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('deleted_by')->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
