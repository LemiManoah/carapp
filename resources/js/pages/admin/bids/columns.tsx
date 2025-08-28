"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Bid } from "@/types/bids"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Schema::create('bids', function (Blueprint $table) {
//   $table->id();
//   $table->foreignId('car_id')->constrained()->onDelete('cascade');
//   $table->foreignId('user_id')->constrained()->onDelete('cascade');
//   $table->decimal('bid_price', 12, 2);
//   $table->enum('bid_status', ['Pending', 'Accepted', 'Rejected', 'Withdrawn'])->default('Pending');
//   $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('cascade');
//   $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('cascade');
//   $table->foreignId('deleted_by')->nullable()->constrained('users')->onDelete('cascade');
//   $table->softDeletes();
//   $table->timestamps();
  
//   $table->index(['car_id', 'bid_status']);
//   $table->index('bid_price');
// });

export const columns: ColumnDef<Bid>[] = [
  {
    accessorKey: "car_id",
    header: "Car",
    cell: ({ row }) => {
      const car = (row.original as any).car as { brand?: string; model?: string } | undefined;
      return car ? `${car.brand ?? ''} ${car.model ?? ''}`.trim() : String(row.original.car_id);
    },
  },
  {
    accessorKey: "user_id",
    header: "User",
    cell: ({ row }) => {
      const user = (row.original as any).user as { name?: string } | undefined;
      return user?.name ?? String(row.original.user_id);
    },
  },
  {
    accessorKey: "bid_price",
    header: "Bid Price",
  },
  {
    accessorKey: "bid_status",
    header: "Bid Status",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => row.original.created_at,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => (table?.options as any)?.meta?.onEdit?.(row.original)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={ () => (table?.options as any)?.meta?.onDelete?.(row.original)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]