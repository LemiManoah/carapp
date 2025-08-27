import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import type { Location } from "@/types/location";
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import LocationModal, { LocationLike } from './location-modal';
import ConfirmDeleteDialog from '@/components/common/confirm-delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Locations',
        href: '/admin/locations',
    },
];

type LocationsPaginator = { data: Location[] } & Record<string, unknown>;

interface LocationsIndexProps {
    locations: LocationsPaginator;
}

export default function LocationsIndex({ locations }: LocationsIndexProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedLocation, setSelectedLocation] = React.useState<LocationLike | null>(null);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteLocation, setDeleteLocation] = React.useState<LocationLike | null>(null);

    const navigate = (page: number) => {
        setLoading(true);
        setError(null);
        router.get(
            '/admin/locations',
            { page },
            {
                preserveState: true,
                replace: true,
                onError: (errs: any) => {
                    const msg = typeof errs === 'string' ? errs : 'Failed to load locations.';
                    setError(msg);
                    toast.error(msg);
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    const openCreate = () => {
        setSelectedLocation(null);
        setModalOpen(true);
    };

    const onEdit = (location: LocationLike) => {
        setSelectedLocation(location);
        setModalOpen(true);
    };

    const onDelete = (location: LocationLike) => {
        setDeleteLocation(location);
        setDeleteOpen(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Locations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-2">
                    <div className="flex items-center justify-between p-2">
                        <div className="font-semibold">Manage Locations</div>
                        <Button onClick={openCreate}>Create Location</Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={locations.data ?? []}
                        loading={loading}
                        error={error}
                        meta={{ onEdit, onDelete }}
                        pagination={{
                            currentPage: (locations as any).current_page ?? 1,
                            lastPage: (locations as any).last_page ?? 1,
                            onNavigate: navigate,
                        }}
                        filterColumn="city_name"
                    />
                    <LocationModal
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        location={selectedLocation ?? undefined}
                    />
                    <ConfirmDeleteDialog
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        action={deleteLocation?.id ? `/admin/locations/${deleteLocation.id}` : null}
                        title="Delete location"
                        description={
                            <span>
                                Are you sure you want to permanently delete <span className="font-semibold">{deleteLocation?.city_name ?? 'this location'}</span>? This action cannot be undone.
                            </span>
                        }
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onSuccess={() => toast.success('Location deleted')}
                        onError={() => toast.error('Failed to delete location')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
