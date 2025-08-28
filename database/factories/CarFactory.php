<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = ['Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Ford', 'BMW', 'Mercedes-Benz'];
        $bodyTypes = ['MPV', 'SUV', 'Van', 'Sedan', 'Hatchback', 'Wagon', 'Coupe', 'Convertible'];
        $carTypes = ['Manual', 'Automatic'];
        $fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
        $colors = ['White', 'Black', 'Silver', 'Red', 'Blue', 'Green', 'Yellow', 'Gray'];

        return [
            'brand' => fake()->randomElement($brands),
            'model' => fake()->word() . ' ' . fake()->word(),
            'body_type' => fake()->randomElement($bodyTypes),
            'car_type' => fake()->randomElement($carTypes),
            'year' => fake()->numberBetween(2000, 2024),
            'price' => fake()->numberBetween(50000000, 500000000),
            'mileage' => fake()->numberBetween(1000, 200000),
            'fuel_type' => fake()->randomElement($fuelTypes),
            'color' => fake()->randomElement($colors),
        ];
    }
}
