"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Advertisment } from "@/types/advertisments"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export const columns: ColumnDef<Advertisment>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "car",
    header: "Car",
    cell: ({ row }) => {
      const car = row.original.car as any;
      const name = car ? `${car.brand} ${car.model}` : `#${row.original.car_id}`;
      const img = car?.thumb_url as string | undefined;
      return (
        <div className="flex items-center gap-3">
          {img ? (
            <img
              src={img}
              alt={name}
              className="h-10 w-14 rounded object-cover border"
            />
          ) : (
            <div className="h-10 w-14 rounded border bg-muted" />
          )}
          <div className="flex flex-col">
            <span className="font-medium leading-tight">{name}</span>
            <span className="text-xs text-muted-foreground">ID: {row.original.car_id}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user as any;
      if (user) {
        return (
          <div className="flex flex-col">
            <span className="font-medium leading-tight">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        );
      }
      return <span>#{row.original.user_id}</span>;
    },
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }) => (row.original.is_active ? "Yes" : "No"),
  },
  {
    accessorKey: "allows_bidding",
    header: "Allows Bidding",
    cell: ({ row }) => (row.original.allows_bidding ? "Yes" : "No"),
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
          <DropdownMenuItem onClick={() => (table?.options as any)?.meta?.onDelete?.(row.original)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
