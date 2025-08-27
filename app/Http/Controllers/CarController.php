<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Http\Requests\StoreCarRequest;
use App\Http\Requests\UpdateCarRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Car::class, 'car');
    }

    public function index(StoreCarRequest $request): Response
    {
        $query = Car::query();

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

        Car::create($validated);

        return redirect()->route('admin.cars.index')->with('success', 'Car created successfully.');
    }

    public function update(UpdateCarRequest $request, Car $car): RedirectResponse
    {
        $validated = $request->validated();

        $car->update($validated);

        return redirect()->route('admin.cars.index')->with('success', 'Car updated successfully.');
    }

    public function destroy(Car $car): RedirectResponse
    {
        $car->delete();
        return redirect()->route('admin.cars.index')->with('success', 'Car deleted successfully.');
    }

    public function restore(Car $car): RedirectResponse
    {
        $car->restore();
        return redirect()->route('admin.cars.index')->with('success', 'Car restored successfully.');
    }

    public function forceDelete(Car $car): RedirectResponse
    {
        $car->forceDelete();
        return redirect()->route('admin.cars.index')->with('success', 'Car deleted successfully.');
    }
}
