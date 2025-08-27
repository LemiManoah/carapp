<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
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

    // Admin CRUD routes (policy-protected). Kept separate to avoid path conflicts with existing admin role endpoints.
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        // Roles CRUD mounted at /admin/roles
        Route::resource('roles', RoleController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

