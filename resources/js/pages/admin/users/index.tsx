import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { User } from '@/types';
import React from 'react';
import { toast } from 'sonner';
import ConfirmDeleteDialog from '@/components/common/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import UserModal, { type UserLike } from './user-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

type UsersPaginator = { data: User[] } & Record<string, unknown>;

interface UsersIndexProps {
    users: UsersPaginator;
}

export default function UsersIndex({ users }: UsersIndexProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<UserLike | null>(null);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteUser, setDeleteUser] = React.useState<User | null>(null);

    const navigate = (page: number) => {
        setLoading(true);
        setError(null);
        router.get(
            '/admin/users',
            { page },
            {
                preserveState: true,
                replace: true,
                onError: (errs: any) => {
                    const msg = typeof errs === 'string' ? errs : 'Failed to load users.';
                    setError(msg);
                    toast.error(msg);
                },
                onFinish: () => setLoading(false),
            }
        );
    };
    const onDelete = (user: User) => {
        setDeleteUser(user);
        setDeleteOpen(true);
    };
    const openCreate = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };
    const onEdit = (user: UserLike) => {
        setSelectedUser(user);
        setModalOpen(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-2">
                    <div className="flex items-center justify-between p-2">
                        <div className="font-semibold">Manage Users</div>
                        <Button onClick={openCreate}>Create User</Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={users.data ?? []}
                        loading={loading}
                        error={error}
                        pagination={{
                            currentPage: (users as any).current_page ?? 1,
                            lastPage: (users as any).last_page ?? 1,
                            onNavigate: navigate,
                        }}
                        meta={{ onEdit, onDelete }}
                    />
                </div>
            </div>
            <UserModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                user={selectedUser ?? undefined}
            />
            <ConfirmDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                action={deleteUser?.id ? `/admin/users/${deleteUser.id}` : null}
                title="Delete user"
                description={
                    <span>
                        Are you sure you want to permanently delete <span className="font-semibold">{deleteUser?.name ?? 'this user'}</span>? This action cannot be undone.
                    </span>
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onSuccess={() => toast.success('User deleted')}
                onError={() => toast.error('Failed to delete user')}
            />
        </AppLayout>
    );
}
