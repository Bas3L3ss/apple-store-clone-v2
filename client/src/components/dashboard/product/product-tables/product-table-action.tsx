import React, { useState } from "react";
import { DataTableFilterBox } from "../../ui/table/data-table-filter-box";
import { DataTableResetFilter } from "../../ui/table/data-table-reset-filter";
import { DataTableSearch } from "../../ui/table/data-table-search";
import {
  CATEGORY_OPTIONS,
  useProductTableFilters,
} from "./use-product-table-filters";
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
import { deleteProducts } from "@/src/action/products";
import { Button } from "@/src/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { invalidateAllProductsCache } from "@/src/react-query-hooks/use-get-products";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductTableAction({
  selectedProductIds,
  setSelectedProductIds,
}: {
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedProductIds: string[];
}) {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setSearchQuery,
  } = useProductTableFilters();
  const [isDeletingProducts, setIsDeletingProducts] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeletingProducts(true);
    setOpen(false);

    try {
      await deleteProducts(selectedProductIds);
      invalidateAllProductsCache(queryClient);
      // Clear selection after deletion
      setSelectedProductIds([]);
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
        filterKey="categories"
        title="Categories"
        options={CATEGORY_OPTIONS}
        // @ts-expect-error: no prob
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
      {selectedProductIds.length > 0 && (
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
              {selectedProductIds.length}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedProductIds.length}{" "}
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
