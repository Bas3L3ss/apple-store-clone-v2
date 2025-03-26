"use client";
import { Button } from "@/src/components/ui/button";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { useEffect } from "react";

interface ApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: ApiResponse<TData> | null;
  loading?: boolean;
  pageSizeOptions?: number[];
  onPageChange?: (page: number, limit: number) => void;
  setSelectedOption?: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DataTable<TData>({
  columns,
  data,
  setSelectedOption,
  loading = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onPageChange,
}: DataTableProps<TData>) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Get current page and limit from URL or use defaults
  const currentPage = parseInt(queryParams.get("page") || "1", 10);
  const pageSize = parseInt(queryParams.get("limit") || "10", 10);

  // Calculate pagination from API response or use defaults
  const pagination = data?.pagination || {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: pageSize,
  };

  const totalItems = pagination.total;
  const totalPages = pagination.totalPages;

  // Setup table with pagination
  const table = useReactTable({
    data: data?.data || [],
    enableRowSelection: true,
    columns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },

    onPaginationChange: (updater) => {
      const state =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize })
          : updater;

      const newPage = state.pageIndex + 1;
      const newLimit = state.pageSize;

      // Update URL parameters
      queryParams.set("page", newPage.toString());
      queryParams.set("limit", newLimit.toString());
      navigate({ search: queryParams.toString() });

      // Call onPageChange callback if provided
      if (onPageChange) {
        onPageChange(newPage, newLimit);
      }
    },

    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });
  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  // Sync table with URL parameters when they change externally
  useEffect(() => {
    if (setSelectedOption && selectedData.length > 0) {
      const newSelectedIds = selectedData
        .map((value) => value._id)
        .filter(Boolean);
      setSelectedOption((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newSelectedIds)
          ? newSelectedIds
          : prev
      );
    }
  }, [selectedData, setSelectedOption]);
  useEffect(() => {
    table.setPagination({
      pageIndex: currentPage - 1,
      pageSize,
    });
  }, [currentPage, pageSize, table]);

  return (
    <div className="flex flex-1 flex-col space-y-4">
      {/* Table container */}
      <div className="relative flex flex-1">
        <div className="   w-full h-[500px] bottom-0 left-0 right-0 top-0 flex overflow-scroll rounded-md border md:overflow-auto">
          <ScrollArea className="flex-1">
            <Table className="relative">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading...
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex  flex-col items-center justify-end gap-2 space-x-2 py-2 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {totalItems > 0 ? (
              <>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
                entries
              </>
            ) : (
              "No entries found"
            )}
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Rows per page
              </p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  const newLimit = Number(value);
                  // Reset to page 1 when changing page size
                  queryParams.set("page", "1");
                  queryParams.set("limit", value);
                  navigate({ search: queryParams.toString() });

                  if (onPageChange) {
                    onPageChange(1, newLimit);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[150px] items-center justify-center text-sm font-medium">
            {totalItems > 0 ? (
              <>
                Page {currentPage} of {totalPages}
              </>
            ) : (
              "No pages"
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                queryParams.set("page", "1");
                navigate({ search: queryParams.toString() });

                if (onPageChange) {
                  onPageChange(1, pageSize);
                }
              }}
              disabled={currentPage <= 1}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                const prevPage = Math.max(1, currentPage - 1);
                queryParams.set("page", prevPage.toString());
                navigate({ search: queryParams.toString() });

                if (onPageChange) {
                  onPageChange(prevPage, pageSize);
                }
              }}
              disabled={currentPage <= 1}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                const nextPage = Math.min(totalPages, currentPage + 1);
                queryParams.set("page", nextPage.toString());
                navigate({ search: queryParams.toString() });

                if (onPageChange) {
                  onPageChange(nextPage, pageSize);
                }
              }}
              disabled={currentPage >= totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                queryParams.set("page", totalPages.toString());
                navigate({ search: queryParams.toString() });

                if (onPageChange) {
                  onPageChange(totalPages, pageSize);
                }
              }}
              disabled={currentPage >= totalPages}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
