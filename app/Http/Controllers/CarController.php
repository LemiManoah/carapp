<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Http\Requests\StoreCarRequest;
use App\Http\Requests\UpdateCarRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Car::class, 'car');
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Car::class);
        $query = Car::query()->with('media');

        if ($search = $request->string('search')->toString()) {
            $query->where('brand', 'like', "%{$search}%")
            ->orWhere('model', 'like', "%{$search}%")
            ->orWhere('body_type', 'like', "%{$search}%")
            ->orWhere('car_type', 'like', "%{$search}%")
            ->orWhere('year', 'like', "%{$search}%")
            ->orWhere('price', 'like', "%{$search}%")
            ->orWhere('mileage', 'like', "%{$search}%")
            ->orWhere('fuel_type', 'like', "%{$search}%")
            ->orWhere('color', 'like', "%{$search}%");
        }

        $cars = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/cars/index', [
            'cars' => $cars,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(StoreCarRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $car = Car::create($validated);

        // Attach uploaded images to media collection if provided
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if ($image->isValid()) {
                    $car->addMedia($image)->toMediaCollection('images');
                }
            }
        }

        return redirect()->route('admin.cars.index')->with('success', 'Car created successfully.');
    }

    public function update(UpdateCarRequest $request, Car $car): RedirectResponse
    {
        $this->authorize('update', $car);
        $validated = $request->validated();

        // Update basic attributes
        $car->update(collect($validated)->except(['images', 'removed_media_ids'])->all());

        // Remove selected media items by id
        $idsToRemove = collect($validated['removed_media_ids'] ?? [])->filter()->all();
        if (!empty($idsToRemove)) {
            foreach ($car->media()->whereIn('id', $idsToRemove)->get() as $media) {
                $media->delete();
            }
        }

        // Attach any newly uploaded images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if ($image && $image->isValid()) {
                    $car->addMedia($image)->toMediaCollection('images');
                }
            }
        }

        return redirect()->route('admin.cars.index')->with('success', 'Car updated successfully.');
    }

    public function destroy(Car $car): RedirectResponse
    {
        $this->authorize('delete', $car);
        $car->delete();
        return redirect()->route('admin.cars.index')->with('success', 'Car deleted successfully.');
    }

    public function restore(Car $car): RedirectResponse
    {
        $this->authorize('restore', $car);
        $car->restore();
        return redirect()->route('admin.cars.index')->with('success', 'Car restored successfully.');
    }

    public function forceDelete(Car $car): RedirectResponse
    {
        $this->authorize('forceDelete', $car);
        $car->forceDelete();
        return redirect()->route('admin.cars.index')->with('success', 'Car deleted successfully.');
    }
}
