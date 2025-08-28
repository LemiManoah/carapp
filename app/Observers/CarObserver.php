<?php

namespace App\Observers;

use App\Models\Car;
use Illuminate\Support\Facades\Auth;

class CarObserver
{
    /**
     * Handle the Car "creating" event.
     */
    public function creating(Car $car): void
    {
        if (Auth::check()) {
            $car->created_by = Auth::id();
            $car->updated_by = Auth::id();
        }
        // Ensure this is null on create (defensive in case DB column is NOT NULL by mistake)
        $car->deleted_by = null;
    }

    /**
     * Handle the Car "updating" event.
     */
    public function updating(Car $car): void
    {
        if (Auth::check()) {
            $car->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Car "deleting" event.
     * For soft deletes, set deleted_by before delete.
     */
    public function deleting(Car $car): void
    {
        if (Auth::check()) {
            $car->deleted_by = Auth::id();
            // Save quietly to avoid recursion in events
            $car->saveQuietly();
        }
    }

    /**
     * Handle the Car "restoring" event.
     */
    public function restoring(Car $car): void
    {
        $car->deleted_by = null;
    }
    
}

