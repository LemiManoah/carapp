import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import type { Bid } from "@/types/bids";
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConfirmDeleteDialog from '@/components/common/confirm-delete-dialog';
import BidModal from './bid-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Bids',
        href: '/admin/bids',
    },
];

type BidsPaginator = { data: Bid[] } & Record<string, unknown>;

interface BidsIndexProps {
    bids: BidsPaginator;
}

export default function BidsIndex({ bids }: BidsIndexProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedBid, setSelectedBid] = React.useState<Bid | null>(null);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteBid, setDeleteBid] = React.useState<Bid | null>(null);

    const navigate = (page: number) => {
        setLoading(true);
        setError(null);
        router.get(
            '/admin/bids',
            { page },
            {
                preserveState: true,
                replace: true,
                onError: (errs: any) => {
                    const msg = typeof errs === 'string' ? errs : 'Failed to load bids.';
                    setError(msg);
                    toast.error(msg);
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    const openCreate = () => {
        setSelectedBid(null);
        setModalOpen(true);
    };

    const onEdit = (bid: Bid) => {
        setSelectedBid(bid);
        setModalOpen(true);
    };

    const onDelete = (bid: Bid) => {
        setDeleteBid(bid);
        setDeleteOpen(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bids" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-2">
                    <div className="flex items-center justify-between p-2">
                        <div className="font-semibold">Manage Bids</div>
                        <Button onClick={openCreate}>Create Bid</Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={bids.data ?? []}
                        loading={loading}
                        error={error}
                        meta={{ onEdit, onDelete }}
                        pagination={{
                            currentPage: (bids as any).current_page ?? 1,
                            lastPage: (bids as any).last_page ?? 1,
                            onNavigate: navigate,
                        }}
                        filterColumn="bid_price"
                    />
                    <BidModal
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        bid={selectedBid ?? undefined}
                    />
                    <ConfirmDeleteDialog
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        action={deleteBid?.id ? `/admin/bids/${deleteBid.id}` : null}
                        title="Delete bid"
                        description={
                            <span>
                                Are you sure you want to permanently delete <span className="font-semibold">{deleteBid?.bid_price ?? 'this bid'}</span>? This action cannot be undone.
                            </span>
                        }
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onSuccess={() => toast.success('Bid deleted')}
                        onError={() => toast.error('Failed to delete bid')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
