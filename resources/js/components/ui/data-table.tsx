"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: {
    currentPage: number
    lastPage: number
    onNavigate: (page: number) => void
  }
  loading?: boolean
  error?: string | null
  meta?: any
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  loading = false,
  error = null,
  meta,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    meta,
    state: {
      columnFilters,
    },
  })
  

  return (
    <div>
        <div className="flex items-center py-4">
        <Input
          placeholder="Filter..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          disabled={loading}
        />
      </div>
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                <span className="inline-flex items-center gap-2 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </span>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && pagination.lastPage > 1 && (
        <Pagination className="py-3">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={loading}
                data-disabled={loading}
                onClick={(e) => {
                  e.preventDefault()
                  if (loading) return
                  const prev = Math.max(1, pagination.currentPage - 1)
                  if (prev !== pagination.currentPage) pagination.onNavigate(prev)
                }}
                href="#"
              />
            </PaginationItem>
            {Array.from({ length: pagination.lastPage }).map((_, idx) => {
              const page = idx + 1
              const isActive = page === pagination.currentPage
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={isActive}
                    aria-disabled={loading || isActive}
                    data-disabled={loading || isActive}
                    onClick={(e) => {
                      e.preventDefault()
                      if (loading || isActive) return
                      pagination.onNavigate(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                aria-disabled={loading}
                data-disabled={loading}
                onClick={(e) => {
                  e.preventDefault()
                  if (loading) return
                  const next = Math.min(pagination.lastPage, pagination.currentPage + 1)
                  if (next !== pagination.currentPage) pagination.onNavigate(next)
                }}
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
    </div>
  )
}