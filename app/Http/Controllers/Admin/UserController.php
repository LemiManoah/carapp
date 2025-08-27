<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    public function index(Request $request): Response
    {
        $query = User::query()->with([
            'roles:roles.id,name',
            'location:id,city_name',
        ]);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        // dd($users);
        return Inertia::render('admin/users/index', [
            'users' => $users,
            // Provide options for the modal
            'roles' => Role::query()->orderBy('name')->pluck('name'),
            // Align with migration: locations.city_name exists (not 'name')
            // Send { id, name } to the frontend to match the modal's expectations
            'locations' => DB::table('locations')
                ->select('id', DB::raw('city_name as name'))
                ->orderBy('city_name')
                ->get(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(User $user): Response
    {
        return Inertia::render('admin/users/show', [
            'user' => $user->load('roles:roles.id,name'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'contact' => ['nullable', 'string', 'max:50'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['string'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'contact' => $validated['contact'] ?? null,
            'location_id' => $validated['location_id'] ?? null,
        ]);

        if (!empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user->load('roles:name'),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'contact' => ['nullable', 'string', 'max:50'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['string'],
        ]);

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'contact' => $validated['contact'] ?? null,
            'location_id' => $validated['location_id'] ?? null,
        ]);

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        if (array_key_exists('roles', $validated)) {
            $user->syncRoles($validated['roles'] ?? []);
        }

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
