<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdvertismentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        $carId = \App\Models\Car::query()->value('id');
        $userId = \App\Models\User::query()->value('id');

        if (!$carId || !$userId) {
            // Nothing to seed without base references
            return;
        }

        $adverts = [
            [
                'car_id' => $carId,
                'user_id' => $userId,
                'title' => 'Great Family SUV',
                'description' => 'Well-maintained, low mileage, perfect for family trips.',
                'is_active' => true,
                'allows_bidding' => true,
            ],
            [
                'car_id' => $carId,
                'user_id' => $userId,
                'title' => 'Sporty Hatchback',
                'description' => 'Responsive handling, recent service, excellent condition.',
                'is_active' => true,
                'allows_bidding' => false,
            ],
        ];

        DB::table('advertisments')->insert(
            array_map(function ($ad) use ($now) {
                return $ad + ['created_at' => $now, 'updated_at' => $now];
            }, $adverts)
        );
    }
}
