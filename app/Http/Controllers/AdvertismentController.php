<?php

namespace App\Http\Controllers;

use App\Models\Advertisment;
use App\Http\Requests\StoreAdvertismentRequest;
use App\Http\Requests\UpdateAdvertismentRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdvertismentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Advertisment::class, 'advertisment');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(StoreAdvertismentRequest $request): Response
    {
        $this->authorize('viewAny', Advertisment::class);
        $query = Advertisment::query()->with(['car', 'user']);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $advertisments = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/advertisments/index', [
            'advertisments' => $advertisments,
            'filters' => [
                'search' => $search ?? null,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Advertisment::class);
        return Inertia::render('admin/advertisments/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdvertismentRequest $request): RedirectResponse
    {
        $this->authorize('create', Advertisment::class);
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;
        Advertisment::create($validated);
        return redirect()->route('admin.advertisments.index')->with('success', 'Advertisment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Advertisment $advertisment): Response
    {
        $this->authorize('view', Advertisment::class);
        $advertisment->load(['car', 'user']);
        return Inertia::render('admin/advertisments/show', [
            'advertisment' => $advertisment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Advertisment $advertisment): Response
    {
        $this->authorize('update', Advertisment::class);
        $advertisment->load(['car', 'user']);
        return Inertia::render('admin/advertisments/edit', [
            'advertisment' => $advertisment,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdvertismentRequest $request, Advertisment $advertisment): RedirectResponse
    {
        $this->authorize('update', Advertisment::class);
        $validated = $request->validated();
        $validated['updated_by'] = $request->user()->id;
        $advertisment->update($validated);
        return redirect()->route('admin.advertisments.index')->with('success', 'Advertisment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Advertisment $advertisment): RedirectResponse
    {
        $this->authorize('delete', Advertisment::class);
        $advertisment->deleted_by = request()->user()->id;
        $advertisment->save();
        $advertisment->delete();
        return redirect()->route('admin.advertisments.index')->with('success', 'Advertisment deleted successfully.');
    }

    public function restore(Advertisment $advertisment): RedirectResponse
    {
        $this->authorize('restore', Advertisment::class);
        $advertisment->restore();
        return redirect()->route('admin.advertisments.index')->with('success', 'Advertisment restored successfully.');
    }

    public function forceDelete(Advertisment $advertisment): RedirectResponse
    {
        $this->authorize('forceDelete', Advertisment::class);
        $advertisment->forceDelete();
        return redirect()->route('admin.advertisments.index')->with('success', 'Advertisment deleted successfully.');
    }
}
