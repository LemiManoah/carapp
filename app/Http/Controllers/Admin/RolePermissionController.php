<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\RolePermissionService;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RolePermissionController extends Controller
{
    public function __construct(
        private RolePermissionService $rolePermissionService
    ) {
        $this->middleware('permission:manage roles');
    }

    /**
     * Display the roles and permissions management page.
     */
    public function index(): Response
    {
        $roles = $this->rolePermissionService->getAllRolesWithPermissions();
        $permissions = $this->rolePermissionService->getAllPermissions();
        $permissionCategories = $this->rolePermissionService->getPermissionCategories();
        $availableRoles = $this->rolePermissionService->getAvailableRoles();
        $rolePermissionsMapping = $this->rolePermissionService->getRolePermissionsMapping();

        return Inertia::render('Admin/RolesPermissions/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'permissionCategories' => $permissionCategories,
            'availableRoles' => $availableRoles,
            'rolePermissionsMapping' => $rolePermissionsMapping,
        ]);
    }

    /**
     * Get all roles.
     */
    public function getRoles(): JsonResponse
    {
        $roles = $this->rolePermissionService->getAllRolesWithPermissions();
        
        return response()->json($roles);
    }

    /**
     * Get all permissions.
     */
    public function getPermissions(): JsonResponse
    {
        $permissions = $this->rolePermissionService->getAllPermissions();
        
        return response()->json($permissions);
    }

    /**
     * Create a new role.
     */
    public function storeRole(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = $this->rolePermissionService->createRole(
            $request->name,
            $request->permissions ?? []
        );

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('permissions'),
        ], 201);
    }

    /**
     * Update a role.
     */
    public function updateRole(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->update(['name' => $request->name]);
        $this->rolePermissionService->updateRolePermissions($role, $request->permissions ?? []);

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role->load('permissions'),
        ]);
    }

    /**
     * Delete a role.
     */
    public function deleteRole(Role $role): JsonResponse
    {
        if ($role->name === 'super-admin') {
            return response()->json([
                'message' => 'Cannot delete super-admin role',
            ], 422);
        }

        $this->rolePermissionService->deleteRole($role);

        return response()->json([
            'message' => 'Role deleted successfully',
        ]);
    }

    /**
     * Get users by role.
     */
    public function getUsersByRole(string $roleName): JsonResponse
    {
        $users = $this->rolePermissionService->getUsersByRole($roleName);
        
        return response()->json($users);
    }

    /**
     * Assign role to user.
     */
    public function assignRoleToUser(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_name' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($request->user_id);
        $this->rolePermissionService->assignRoleToUser($user, $request->role_name);

        return response()->json([
            'message' => 'Role assigned successfully',
            'user' => $user->load('roles'),
        ]);
    }

    /**
     * Remove role from user.
     */
    public function removeRoleFromUser(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_name' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($request->user_id);
        
        if ($user->hasRole('super-admin') && $request->role_name === 'super-admin') {
            return response()->json([
                'message' => 'Cannot remove super-admin role from super-admin user',
            ], 422);
        }

        $this->rolePermissionService->removeRoleFromUser($user, $request->role_name);

        return response()->json([
            'message' => 'Role removed successfully',
            'user' => $user->load('roles'),
        ]);
    }

    /**
     * Get user roles and permissions.
     */
    public function getUserRolesAndPermissions(User $user): JsonResponse
    {
        $roles = $this->rolePermissionService->getUserRoles($user);
        $permissions = $this->rolePermissionService->getUserPermissions($user);

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Get users with specific permission.
     */
    public function getUsersWithPermission(string $permission): JsonResponse
    {
        $users = $this->rolePermissionService->getUsersWithPermission($permission);
        
        return response()->json($users);
    }

    /**
     * Get permission statistics.
     */
    public function getPermissionStats(): JsonResponse
    {
        $stats = [
            'total_roles' => Role::count(),
            'total_permissions' => Permission::count(),
            'total_users' => User::count(),
            'users_by_role' => [],
        ];

        $roles = Role::all();
        foreach ($roles as $role) {
            $stats['users_by_role'][$role->name] = User::role($role->name)->count();
        }

        return response()->json($stats);
    }
}
