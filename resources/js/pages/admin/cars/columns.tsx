"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Car } from "@/types/cars"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Car>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const url = (row.original as any).thumb_url as string | undefined
      return (
        <div className="w-16 h-12 overflow-hidden rounded bg-muted flex items-center justify-center">
          {url ? (
            <img src={url} alt="thumb" className="w-full h-full object-cover" />
          ) : (
            <div className="text-xs text-muted-foreground">No image</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "brand",
    header: "Name",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "body_type",
    header: "Body Type",
  },
  {
    accessorKey: "car_type",
    header: "Car Type",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "mileage",
    header: "Mileage",
  },
  {
    accessorKey: "fuel_type",
    header: "Fuel Type",
  },
  {
    accessorKey: "color",
    header: "Color",
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

