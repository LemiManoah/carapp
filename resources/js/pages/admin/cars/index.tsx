import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import CarModal from './car-modal';
import ConfirmDeleteDialog from '@/components/common/confirm-delete-dialog';
import { Car } from '@/types/cars';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Cars',
        href: '/admin/cars',
    },
];

type CarsPaginator = { data: Car[] } & Record<string, unknown>;

interface CarsIndexProps {
    cars: CarsPaginator;
}

export default function CarsIndex({ cars }: CarsIndexProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedCar, setSelectedCar] = React.useState<Car | null>(null);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteCar, setDeleteCar] = React.useState<Car | null>(null);

    const navigate = (page: number) => {
        setLoading(true);
        setError(null);
        router.get(
            '/admin/cars',
            { page },
            {
                preserveState: true,
                replace: true,
                onError: (errs: any) => {
                    const msg = typeof errs === 'string' ? errs : 'Failed to load cars.';
                    setError(msg);
                    toast.error(msg);
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    const openCreate = () => {
        setSelectedCar(null);
        setModalOpen(true);
    };

    const onEdit = (car: Car) => {
        setSelectedCar(car);
        setModalOpen(true);
    };

    const onDelete = (car: Car) => {
        setDeleteCar(car);
        setDeleteOpen(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cars" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-2">
                    <div className="flex items-center justify-between p-2">
                        <div className="font-semibold">Manage Cars</div>
                        <Button onClick={openCreate}>Create Car</Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={cars.data ?? []}
                        loading={loading}
                        error={error}
                        meta={{ onEdit, onDelete }}
                        pagination={{
                            currentPage: (cars as any).current_page ?? 1,
                            lastPage: (cars as any).last_page ?? 1,
                            onNavigate: navigate,
                        }}
                        filterColumn="brand"
                    />
                    <CarModal
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        car={selectedCar ?? undefined}
                    />
                    <ConfirmDeleteDialog
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        action={deleteCar?.id ? `/admin/cars/${deleteCar.id}` : null}
                        title="Delete car"
                        description={
                            <span>
                                Are you sure you want to permanently delete <span className="font-semibold">{deleteCar?.brand ?? 'this car'}</span>? This action cannot be undone.
                            </span>
                        }
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onSuccess={() => toast.success('Car deleted')}
                        onError={() => toast.error('Failed to delete car')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
