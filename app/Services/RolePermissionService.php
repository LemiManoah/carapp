<?php

namespace App\Services;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Collection;

class RolePermissionService
{
    /**
     * Get all roles with their permissions.
     */
    public function getAllRolesWithPermissions(): Collection
    {
        return Role::with('permissions')->get();
    }

    /**
     * Get all permissions.
     */
    public function getAllPermissions(): Collection
    {
        return Permission::all();
    }

    /**
     * Create a new role.
     */
    public function createRole(string $name, array $permissions = []): Role
    {
        $role = Role::create(['name' => $name]);
        
        if (!empty($permissions)) {
            $role->givePermissionTo($permissions);
        }

        return $role;
    }

    /**
     * Update role permissions.
     */
    public function updateRolePermissions(Role $role, array $permissions): Role
    {
        $role->syncPermissions($permissions);
        return $role;
    }

    /**
     * Delete a role.
     */
    public function deleteRole(Role $role): bool
    {
        return $role->delete();
    }

    /**
     * Assign role to user.
     */
    public function assignRoleToUser(User $user, string $roleName): void
    {
        $user->assignRole($roleName);
    }

    /**
     * Remove role from user.
     */
    public function removeRoleFromUser(User $user, string $roleName): void
    {
        $user->removeRole($roleName);
    }

    /**
     * Get user roles.
     */
    public function getUserRoles(User $user): Collection
    {
        return $user->roles;
    }

    /**
     * Get user permissions.
     */
    public function getUserPermissions(User $user): Collection
    {
        return $user->getAllPermissions();
    }

    /**
     * Check if user has specific permission.
     */
    public function userHasPermission(User $user, string $permission): bool
    {
        return $user->hasPermissionTo($permission);
    }

    /**
     * Check if user has specific role.
     */
    public function userHasRole(User $user, string $role): bool
    {
        return $user->hasRole($role);
    }

    /**
     * Get users by role.
     */
    public function getUsersByRole(string $roleName): Collection
    {
        return User::role($roleName)->get();
    }

    /**
     * Get users with specific permission.
     */
    public function getUsersWithPermission(string $permission): Collection
    {
        return User::permission($permission)->get();
    }

    /**
     * Get available roles for car sales website.
     */
    public function getAvailableRoles(): array
    {
        return [
            'super-admin' => 'Super Administrator',
            'admin' => 'Administrator',
            'moderator' => 'Moderator',
            'seller' => 'Seller',
            'buyer' => 'Buyer',
            'guest' => 'Guest',
        ];
    }

    /**
     * Get role permissions mapping.
     */
    public function getRolePermissionsMapping(): array
    {
        return [
            'super-admin' => [
                'description' => 'Full access to all features',
                'permissions' => 'All permissions',
            ],
            'admin' => [
                'description' => 'Administrative access to manage the platform',
                'permissions' => [
                    'view cars', 'create cars', 'edit cars', 'delete cars', 'list cars', 'search cars',
                    'view advertisements', 'create advertisements', 'edit advertisements', 'delete advertisements', 'list advertisements', 'approve advertisements', 'reject advertisements',
                    'view bids', 'create bids', 'edit bids', 'delete bids', 'list bids', 'accept bids', 'reject bids',
                    'view users', 'create users', 'edit users', 'list users',
                    'view locations', 'create locations', 'edit locations', 'delete locations', 'list locations',
                    'view analytics', 'manage settings', 'view logs',
                ],
            ],
            'moderator' => [
                'description' => 'Moderate content and manage disputes',
                'permissions' => [
                    'view cars', 'list cars', 'search cars',
                    'view advertisements', 'list advertisements', 'approve advertisements', 'reject advertisements',
                    'view bids', 'list bids',
                    'view users', 'list users',
                    'view locations', 'list locations',
                    'view analytics',
                ],
            ],
            'seller' => [
                'description' => 'Can list cars and manage advertisements',
                'permissions' => [
                    'view cars', 'create cars', 'edit cars', 'list cars', 'search cars',
                    'view advertisements', 'create advertisements', 'edit advertisements', 'delete advertisements', 'list advertisements',
                    'view bids', 'list bids', 'accept bids', 'reject bids',
                    'view locations', 'list locations',
                ],
            ],
            'buyer' => [
                'description' => 'Can browse cars and place bids',
                'permissions' => [
                    'view cars', 'list cars', 'search cars',
                    'view advertisements', 'list advertisements',
                    'view bids', 'create bids', 'edit bids', 'list bids',
                    'view locations', 'list locations',
                ],
            ],
            'guest' => [
                'description' => 'Limited access for unauthenticated users',
                'permissions' => [
                    'view cars', 'list cars', 'search cars',
                    'view advertisements', 'list advertisements',
                    'view locations', 'list locations',
                ],
            ],
        ];
    }

    /**
     * Get permission categories.
     */
    public function getPermissionCategories(): array
    {
        return [
            'car_management' => [
                'label' => 'Car Management',
                'permissions' => [
                    'view cars', 'create cars', 'edit cars', 'delete cars', 'list cars', 'search cars',
                ],
            ],
            'advertisement_management' => [
                'label' => 'Advertisement Management',
                'permissions' => [
                    'view advertisements', 'create advertisements', 'edit advertisements', 'delete advertisements', 'list advertisements', 'approve advertisements', 'reject advertisements',
                ],
            ],
            'bidding_system' => [
                'label' => 'Bidding System',
                'permissions' => [
                    'view bids', 'create bids', 'edit bids', 'delete bids', 'list bids', 'accept bids', 'reject bids',
                ],
            ],
            'user_management' => [
                'label' => 'User Management',
                'permissions' => [
                    'view users', 'create users', 'edit users', 'delete users', 'list users', 'manage roles', 'manage permissions',
                ],
            ],
            'location_management' => [
                'label' => 'Location Management',
                'permissions' => [
                    'view locations', 'create locations', 'edit locations', 'delete locations', 'list locations',
                ],
            ],
            'system_management' => [
                'label' => 'System Management',
                'permissions' => [
                    'view analytics', 'manage settings', 'view logs', 'backup system', 'restore system',
                ],
            ],
        ];
    }
}
