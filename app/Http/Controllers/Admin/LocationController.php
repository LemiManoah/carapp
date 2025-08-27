<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Location::class, 'location');
    }

    public function index(StoreLocationRequest $request): Response
    {
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
        $validated = $request->validated();

        Location::create($validated);

        return redirect()->route('admin.locations.index')->with('success', 'Location created successfully.');
    }

    public function update(UpdateLocationRequest $request, Location $location): RedirectResponse
    {
        $validated = $request->validated();

        $location->update($validated);

        return redirect()->route('admin.locations.index')->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();
        return redirect()->route('admin.locations.index')->with('success', 'Location deleted successfully.');
    }
}
