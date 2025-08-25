<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Components gallery
    Route::get('components', function () {
        return Inertia::render('components/index');
    })->name('components');

    // Admin routes
    Route::middleware(['permission:manage roles'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('roles-permissions', [RolePermissionController::class, 'index'])->name('roles-permissions.index');
        Route::get('roles', [RolePermissionController::class, 'getRoles'])->name('roles.index');
        Route::post('roles', [RolePermissionController::class, 'storeRole'])->name('roles.store');
        Route::put('roles/{role}', [RolePermissionController::class, 'updateRole'])->name('roles.update');
        Route::delete('roles/{role}', [RolePermissionController::class, 'deleteRole'])->name('roles.destroy');
        Route::get('permissions', [RolePermissionController::class, 'getPermissions'])->name('permissions.index');
        Route::get('roles/{roleName}/users', [RolePermissionController::class, 'getUsersByRole'])->name('roles.users');
        Route::post('users/assign-role', [RolePermissionController::class, 'assignRoleToUser'])->name('users.assign-role');
        Route::delete('users/remove-role', [RolePermissionController::class, 'removeRoleFromUser'])->name('users.remove-role');
        Route::get('users/{user}/roles-permissions', [RolePermissionController::class, 'getUserRolesAndPermissions'])->name('users.roles-permissions');
        Route::get('permissions/{permission}/users', [RolePermissionController::class, 'getUsersWithPermission'])->name('permissions.users');
        Route::get('permissions-stats', [RolePermissionController::class, 'getPermissionStats'])->name('permissions.stats');
    });

    // Admin CRUD routes (policy-protected). Kept separate to avoid path conflicts with existing admin role endpoints.
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        // Use a non-conflicting path for role CRUD since 'admin/roles' is already used above
        Route::resource('role-items', RoleController::class)->parameters([
            'role-items' => 'role',
        ]);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

