import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Role } from '@/types';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import RoleModal, { RoleLike } from './role-modal';
import ConfirmDeleteDialog from '@/components/common/confirm-delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Roles',
        href: '/admin/roles',
    },
];


type RolesPaginator = { data: Role[] } & Record<string, unknown>;

interface RolesIndexProps {
    roles: RolesPaginator;
}

export default function RolesIndex({ roles }: RolesIndexProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState<RoleLike | null>(null);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteRole, setDeleteRole] = React.useState<RoleLike | null>(null);

    const navigate = (page: number) => {
        setLoading(true);
        setError(null);
        router.get(
            '/admin/roles',
            { page },
            {
                preserveState: true,
                replace: true,
                onError: (errs: any) => {
                    const msg = typeof errs === 'string' ? errs : 'Failed to load roles.';
                    setError(msg);
                    toast.error(msg);
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    const openCreate = () => {
        setSelectedRole(null);
        setModalOpen(true);
    };

    const onEdit = (role: RoleLike) => {
        setSelectedRole(role);
        setModalOpen(true);
    };

    const onDelete = (role: RoleLike) => {
        setDeleteRole(role);
        setDeleteOpen(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-2">
                    <div className="flex items-center justify-between p-2">
                        <div className="font-semibold">Manage Roles</div>
                        <Button onClick={openCreate}>Create Role</Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={roles.data ?? []}
                        loading={loading}
                        error={error}
                        meta={{ onEdit, onDelete }}
                        pagination={{
                            currentPage: (roles as any).current_page ?? 1,
                            lastPage: (roles as any).last_page ?? 1,
                            onNavigate: navigate,
                        }}
                    />
                    <RoleModal
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        role={selectedRole ?? undefined}
                    />
                    <ConfirmDeleteDialog
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        action={deleteRole?.id ? `/admin/roles/${deleteRole.id}` : null}
                        title="Delete role"
                        description={
                            <span>
                                Are you sure you want to permanently delete <span className="font-semibold">{deleteRole?.name ?? 'this role'}</span>? This action cannot be undone.
                            </span>
                        }
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onSuccess={() => toast.success('Role deleted')}
                        onError={() => toast.error('Failed to delete role')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
