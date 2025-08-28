import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import type { Advertisment } from "@/types/advertisments";
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConfirmDeleteDialog from '@/components/common/confirm-delete-dialog';
import AdvertismentModal from './advertisment-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Advertisments',
        href: '/admin/advertisments',
    },
];

type AdvertismentsPaginator = { data: Advertisment[] } & Record<string, unknown>;

interface AdvertismentsIndexProps {
    advertisments: AdvertismentsPaginator;
}

export default function AdvertismentsIndex({ advertisments }: AdvertismentsIndexProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedAdvert, setSelectedAdvert] = React.useState<Advertisment | null>(null);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteAdvert, setDeleteAdvert] = React.useState<Advertisment | null>(null);

    const navigate = (page: number) => {
        setLoading(true);
        setError(null);
        router.get(
            '/admin/advertisments',
            { page },
            {
                preserveState: true,
                replace: true,
                onError: (errs: any) => {
                    const msg = typeof errs === 'string' ? errs : 'Failed to load advertisments.';
                    setError(msg);
                    toast.error(msg);
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    const openCreate = () => {
        setSelectedAdvert(null);
        setModalOpen(true);
    };

    const onEdit = (advert: Advertisment) => {
        setSelectedAdvert(advert);
        setModalOpen(true);
    };

    const onDelete = (advert: Advertisment) => {
        setDeleteAdvert(advert);
        setDeleteOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Advertisments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-2">
                    <div className="flex items-center justify-between p-2">
                        <div className="font-semibold">Manage Advertisments</div>
                        <Button onClick={openCreate}>Create Advertisment</Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={advertisments.data ?? []}
                        loading={loading}
                        error={error}
                        meta={{ onEdit, onDelete }}
                        pagination={{
                            currentPage: (advertisments as any).current_page ?? 1,
                            lastPage: (advertisments as any).last_page ?? 1,
                            onNavigate: navigate,
                        }}
                        filterColumn="title"
                    />
                    <AdvertismentModal
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        advertisment={selectedAdvert ?? undefined}
                    />
                    <ConfirmDeleteDialog
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        action={deleteAdvert?.id ? `/admin/advertisments/${deleteAdvert.id}` : null}
                        title="Delete advertisment"
                        description={
                            <span>
                                Are you sure you want to permanently delete <span className="font-semibold">{deleteAdvert?.title ?? 'this advertisment'}</span>? This action cannot be undone.
                            </span>
                        }
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onSuccess={() => toast.success('Advertisment deleted')}
                        onError={() => toast.error('Failed to delete advertisment')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
