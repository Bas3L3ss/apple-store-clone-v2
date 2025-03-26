import { Button } from "@/src/components/ui/button";
import { DataTableFilterBox } from "../../ui/table/data-table-filter-box";
import { DataTableResetFilter } from "../../ui/table/data-table-reset-filter";
import { DataTableSearch } from "../../ui/table/data-table-search";
import {
  USER_TYPE_OPTIONS,
  useUserTableFilters,
  VERIFIED_OPTIONS,
} from "./use-user-table-filters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { cn } from "@/src/lib/utils";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { deleteUsers } from "@/src/action/auth";
import { invalidateAllUsersCache } from "@/src/react-query-hooks/admin/use-get-user-by-id";
import { useQueryClient } from "@tanstack/react-query";

export default function UserTableAction({
  selectedUserIds,
}: {
  setSelectedUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedUserIds: string[];
}) {
  const {
    typeFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    isVerifiedFilter,
    searchQuery,
    setSearchQuery,
  } = useUserTableFilters();

  const [isDeletingProducts, setIsDeletingProducts] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeletingProducts(true);
    setOpen(false);

    try {
      await deleteUsers(selectedUserIds);
      invalidateAllUsersCache(queryClient);
    } catch (error) {
      console.error("Failed to delete products:", error);
    } finally {
      setIsDeletingProducts(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <DataTableFilterBox
        filterKey="type"
        title="User types"
        options={USER_TYPE_OPTIONS}
        // @ts-expect-error: no prob

        setFilterValue={setCategoriesFilter}
        filterValue={typeFilter}
      />
      <DataTableFilterBox
        filterKey="isVerified"
        title="verified?"
        options={VERIFIED_OPTIONS}
        // @ts-expect-error: no prob

        setFilterValue={setCategoriesFilter}
        filterValue={isVerifiedFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />

      {selectedUserIds.length > 0 && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center ",
                isDeletingProducts && "animate-pulse"
              )}
              disabled={isDeletingProducts}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              {selectedUserIds.length}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedUserIds.length}{" "}
                products? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingProducts}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeletingProducts}
              >
                {isDeletingProducts ? "Deleting..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
