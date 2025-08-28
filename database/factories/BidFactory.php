<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bid>
 */
class BidFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fake()->numberBetween(1, 10),
            'car_id' => fake()->numberBetween(1, 10),
            'amount' => fake()->numberBetween(50000000, 500000000),
            'status' => fake()->randomElement(['Pending', 'Accepted', 'Rejected', 'Withdrawn']),
        ];
    }
}
