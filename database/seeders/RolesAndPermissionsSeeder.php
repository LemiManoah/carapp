<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for car management
        $carPermissions = [
            'view cars',
            'create cars',
            'edit cars',
            'delete cars',
            'list cars',
            'search cars',
        ];

        // Create permissions for advertisement management
        $advertisementPermissions = [
            'view advertisements',
            'create advertisements',
            'edit advertisements',
            'delete advertisements',
            'list advertisements',
            'approve advertisements',
            'reject advertisements',
        ];

        // Create permissions for bidding system
        $biddingPermissions = [
            'view bids',
            'create bids',
            'edit bids',
            'delete bids',
            'list bids',
            'accept bids',
            'reject bids',
        ];

        // Create permissions for user management
        $userPermissions = [
            'view users',
            'create users',
            'edit users',
            'delete users',
            'list users',
            'manage roles',
            'manage permissions',
        ];

        // Create permissions for location management
        $locationPermissions = [
            'view locations',
            'create locations',
            'edit locations',
            'delete locations',
            'list locations',
        ];

        // Create permissions for system management
        $systemPermissions = [
            'view analytics',
            'manage settings',
            'view logs',
            'backup system',
            'restore system',
        ];

        // Combine all permissions
        $allPermissions = array_merge(
            $carPermissions,
            $advertisementPermissions,
            $biddingPermissions,
            $userPermissions,
            $locationPermissions,
            $systemPermissions
        );

        // Create permissions
        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions

        // Super Admin Role
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // Admin Role
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo([
            'view cars', 'create cars', 'edit cars', 'delete cars', 'list cars', 'search cars',
            'view advertisements', 'create advertisements', 'edit advertisements', 'delete advertisements', 'list advertisements', 'approve advertisements', 'reject advertisements',
            'view bids', 'create bids', 'edit bids', 'delete bids', 'list bids', 'accept bids', 'reject bids',
            'view users', 'create users', 'edit users', 'list users',
            'view locations', 'create locations', 'edit locations', 'delete locations', 'list locations',
            'view analytics', 'manage settings', 'view logs',
        ]);

        // Moderator Role
        $moderator = Role::firstOrCreate(['name' => 'moderator']);
        $moderator->givePermissionTo([
            'view cars', 'list cars', 'search cars',
            'view advertisements', 'list advertisements', 'approve advertisements', 'reject advertisements',
            'view bids', 'list bids',
            'view users', 'list users',
            'view locations', 'list locations',
            'view analytics',
        ]);

        // Seller Role
        $seller = Role::firstOrCreate(['name' => 'seller']);
        $seller->givePermissionTo([
            'view cars', 'create cars', 'edit cars', 'list cars', 'search cars',
            'view advertisements', 'create advertisements', 'edit advertisements', 'delete advertisements', 'list advertisements',
            'view bids', 'list bids', 'accept bids', 'reject bids',
            'view locations', 'list locations',
        ]);

        // Buyer Role
        $buyer = Role::firstOrCreate(['name' => 'buyer']);
        $buyer->givePermissionTo([
            'view cars', 'list cars', 'search cars',
            'view advertisements', 'list advertisements',
            'view bids', 'create bids', 'edit bids', 'list bids',
            'view locations', 'list locations',
        ]);

        // Guest Role (for unauthenticated users)
        $guest = Role::firstOrCreate(['name' => 'guest']);
        $guest->givePermissionTo([
            'view cars', 'list cars', 'search cars',
            'view advertisements', 'list advertisements',
            'view locations', 'list locations',
        ]);

        // Create a default super admin user
        $firstLocationId = \App\Models\Location::query()->value('id');

        $superAdminUser = \App\Models\User::firstOrCreate(
            ['email' => 'admin@carsales.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'contact' => '+1234567890',
                'location_id' => $firstLocationId,
            ]
        );

        $superAdminUser->assignRole('super-admin');

        $this->command->info('Roles and permissions seeded successfully!');
        $this->command->info('Super Admin created with email: admin@carsales.com and password: password');
    }
}
