<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\AdvertismentController;
use App\Http\Controllers\CarController;
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

    // Cars CRUD mounted at /cars
    Route::resource('cars', CarController::class);
    Route::post('cars/{car}/restore', [CarController::class, 'restore'])->name('cars.restore');
    Route::post('cars/{car}/force-delete', [CarController::class, 'forceDelete'])->name('cars.force-delete');

    // Advertisments CRUD mounted at /advertisments
    Route::resource('advertisments', AdvertismentController::class);
    Route::post('advertisments/{advertisment}/restore', [AdvertismentController::class, 'restore'])->name('advertisments.restore');
    Route::post('advertisments/{advertisment}/force-delete', [AdvertismentController::class, 'forceDelete'])->name('advertisments.force-delete');

    // Bids CRUD mounted at /bids
    Route::resource('bids', BidController::class);
    Route::post('bids/{bid}/restore', [BidController::class, 'restore'])->name('bids.restore');
    Route::post('bids/{bid}/force-delete', [BidController::class, 'forceDelete'])->name('bids.force-delete');

    // Admin CRUD routes (policy-protected). Kept separate to avoid path conflicts with existing admin role endpoints.
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        Route::post('users/{user}/restore', [UserController::class, 'restore'])->name('users.restore');
        Route::post('users/{user}/force-delete', [UserController::class, 'forceDelete'])->name('users.force-delete');
        // Roles CRUD mounted at /admin/roles
        Route::resource('roles', RoleController::class);
        Route::post('roles/{role}/restore', [RoleController::class, 'restore'])->name('roles.restore');
        Route::post('roles/{role}/force-delete', [RoleController::class, 'forceDelete'])->name('roles.force-delete');
        // Locations CRUD mounted at /admin/locations
        Route::resource('locations', LocationController::class);
        Route::post('locations/{location}/restore', [LocationController::class, 'restore'])->name('locations.restore');
        Route::post('locations/{location}/force-delete', [LocationController::class, 'forceDelete'])->name('locations.force-delete');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

