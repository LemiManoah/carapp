<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Location::class, 'location');
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Location::class);
        $query = Location::query();

        if ($search = $request->string('search')->toString()) {
            $query->where('city_name', 'like', "%{$search}%");
        }

        $locations = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/locations/index', [
            'locations' => $locations,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(StoreLocationRequest $request): RedirectResponse
    {
        $this->authorize('create locations');
        $validated = $request->validated();

        Location::create($validated);

        return redirect()->route('admin.locations.index')->with('success', 'Location created successfully.');
    }

    public function update(UpdateLocationRequest $request, Location $location): RedirectResponse
    {
        $this->authorize('edit locations');
        $validated = $request->validated();

        $location->update($validated);

        return redirect()->route('admin.locations.index')->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $this->authorize('delete locations');
        $location->delete();
        return redirect()->route('admin.locations.index')->with('success', 'Location deleted successfully.');
    }
    public function restore(Location $location): RedirectResponse
    {
        $this->authorize('restore locations');
        $location->restore();
        return redirect()->route('admin.locations.index')->with('success', 'Location restored successfully.');
    }
    public function forceDelete(Location $location): RedirectResponse
    {
        $this->authorize('force delete locations');
        $location->forceDelete();
        return redirect()->route('admin.locations.index')->with('success', 'Location force deleted successfully.');
    }
}
