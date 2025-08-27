<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Http\Requests\StoreBidRequest;
use App\Http\Requests\UpdateBidRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BidController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Bid::class, 'bid');
    }

    public function index(StoreBidRequest $request): Response
    {
        $this->authorize('viewAny', Bid::class);
        $query = Bid::query()->with(['car', 'user']);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('bid_status', 'like', "%{$search}%")
                  ->orWhere('bid_price', 'like', "%{$search}%");
            });
        }

        $bids = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/bids/index', [
            'bids' => $bids,
            'filters' => [
                'search' => $search ?? null,
            ],
        ]);
    }

    public function store(StoreBidRequest $request): RedirectResponse
    {
        $this->authorize('create', Bid::class);
        $validated = $request->validated();
        Bid::create($validated);
        return redirect()->route('admin.bids.index')->with('success', 'Bid created successfully.');
    }

    public function show(Bid $bid): Response
    {
        $this->authorize('view', Bid::class);
        $bid->load(['car', 'user']);
        return Inertia::render('admin/bids/show', [
            'bid' => $bid,
        ]);
    }

    public function edit(Bid $bid): Response
    {
        $this->authorize('update', Bid::class);
        $bid->load(['car', 'user']);
        return Inertia::render('admin/bids/edit', [
            'bid' => $bid,
        ]);
    }

    public function update(UpdateBidRequest $request, Bid $bid): RedirectResponse
    {
        $this->authorize('update', Bid::class);
        $validated = $request->validated();
        $bid->update($validated);
        return redirect()->route('admin.bids.index')->with('success', 'Bid updated successfully.');
    }

    public function destroy(Bid $bid): RedirectResponse
    {
        $this->authorize('delete', Bid::class);
        $bid->delete();
        return redirect()->route('admin.bids.index')->with('success', 'Bid deleted successfully.');
    }

    public function restore(Bid $bid): RedirectResponse
    {
        $this->authorize('restore', Bid::class);
        $bid->restore();
        return redirect()->route('admin.bids.index')->with('success', 'Bid restored successfully.');
    }

    public function forceDelete(Bid $bid): RedirectResponse
    {
        $this->authorize('forceDelete', Bid::class);
        $bid->forceDelete();
        return redirect()->route('admin.bids.index')->with('success', 'Bid deleted successfully.');
    }
}
