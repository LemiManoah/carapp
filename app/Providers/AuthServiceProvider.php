<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User as AppUser;
use App\Policies\UserPolicy;
use App\Policies\RolePolicy;
use Spatie\Permission\Models\Role as SpatieRole;
use App\Models\Advertisment;
use App\Policies\AdvertismentPolicy;
use App\Models\Bid;
use App\Policies\BidPolicy;
use App\Models\Location;
use App\Policies\LocationPolicy;
class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        AppUser::class => UserPolicy::class,
        SpatieRole::class => RolePolicy::class,
        Advertisment::class => AdvertismentPolicy::class,
        Bid::class => BidPolicy::class,
        Location::class => LocationPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Policies are automatically registered from $policies

        // Super Admin bypasses all checks
        Gate::before(function ($user, $ability) {
            return method_exists($user, 'hasRole') && ($user->hasRole('super-admin') || $user->hasRole('admin')) ? true : null;
        });
    }
}
