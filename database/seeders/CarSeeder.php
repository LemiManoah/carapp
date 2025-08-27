<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $cars = [
            ['brand' => 'Toyota', 'model' => 'Camry', 'body_type' => 'Sedan', 'car_type' => 'Automatic', 'year' => 2022, 'price' => 150000, 'mileage' => 12000, 'fuel_type' => 'Petrol', 'color' => 'Black'],
            ['brand' => 'Honda', 'model' => 'Civic', 'body_type' => 'Sedan', 'car_type' => 'Automatic', 'year' => 2022, 'price' => 120000, 'mileage' => 10000, 'fuel_type' => 'Petrol', 'color' => 'White'],
            ['brand' => 'Ford', 'model' => 'Mustang', 'body_type' => 'Coupe', 'car_type' => 'Automatic', 'year' => 2022, 'price' => 250000, 'mileage' => 5000, 'fuel_type' => 'Petrol', 'color' => 'Red'],
            ['brand' => 'Chevrolet', 'model' => 'Camaro', 'body_type' => 'Coupe', 'car_type' => 'Automatic', 'year' => 2022, 'price' => 200000, 'mileage' => 8000, 'fuel_type' => 'Petrol', 'color' => 'Blue'],
        ];

        // SQLite requires a UNIQUE/PK on conflict target; to keep this simple and portable,
        // we just insert-or-ignore duplicates here.
        DB::table('cars')->insertOrIgnore(
            array_map(function ($car) use ($now) {
                return $car + ['created_at' => $now, 'updated_at' => $now];
            }, $cars)
        );
    }
}
