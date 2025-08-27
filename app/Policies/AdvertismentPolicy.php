<?php

namespace App\Policies;

use App\Models\Advertisment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AdvertismentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('list advertisments') || $user->can('view advertisments');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Advertisment $advertisment): bool
    {
        return $user->can('view advertisments');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create advertisments');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Advertisment $advertisment): bool
    {
        return $user->can('edit advertisments');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Advertisment $advertisment): bool
    {
        return $user->can('delete advertisments');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Advertisment $advertisment): bool
    {
        return $user->can('restore advertisments');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Advertisment $advertisment): bool
    {
        return $user->can('force delete advertisments');
    }
}
