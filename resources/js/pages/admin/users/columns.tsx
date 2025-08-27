"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Role",
    cell: ({ row }) => {
      const roles = (row.original as any).roles ?? [];
      const names = Array.isArray(roles)
        ? roles.map((r: any) => (typeof r === "string" ? r : r?.name)).filter(Boolean)
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
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "location.city_name",
    header: "Location",
    cell: ({ row }) => row.original.location?.city_name ?? "-",
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