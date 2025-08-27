<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BidSeeder extends Seeder
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

        $bids = [
            ['car_id' => $carId, 'user_id' => $userId, 'bid_price' => 120000, 'bid_status' => 'Pending'],
            ['car_id' => $carId, 'user_id' => $userId, 'bid_price' => 130000, 'bid_status' => 'Accepted'],
            ['car_id' => $carId, 'user_id' => $userId, 'bid_price' => 110000, 'bid_status' => 'Rejected'],
        ];

        DB::table('bids')->insert(
            array_map(function ($bid) use ($now) {
                return $bid + ['created_at' => $now, 'updated_at' => $now];
            }, $bids)
        );
    }
}
