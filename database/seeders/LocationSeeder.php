<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $locations = [
            ['city_name' => 'Nairobi', 'latitude' => -1.286389, 'longitude' => 36.817223],
            ['city_name' => 'Mombasa', 'latitude' => -4.043477, 'longitude' => 39.668206],
            ['city_name' => 'Kisumu', 'latitude' => -0.102210, 'longitude' => 34.761711],
            ['city_name' => 'Eldoret', 'latitude' => 0.514277, 'longitude' => 35.269779],
        ];

        // SQLite requires a UNIQUE/PK on conflict target; to keep this simple and portable,
        // we just insert-or-ignore duplicates here.
        DB::table('locations')->insertOrIgnore(
            array_map(function ($loc) use ($now) {
                return $loc + ['created_at' => $now, 'updated_at' => $now];
            }, $locations)
        );
    }
}
