"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Role } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const perms = (row.original as any).permissions ?? [];
      const names = Array.isArray(perms)
        ? perms.map((p: any) => (typeof p === "string" ? p : p?.name)).filter(Boolean)
        : [];
      if (!names.length) return <span>—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {names.map((name: string) => (
            <Badge key={name} variant="secondary" className="text-xs">
              {name}
            </Badge>
          ))}
        </div>
      );
    },
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