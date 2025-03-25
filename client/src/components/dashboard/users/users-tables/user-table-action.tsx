import { DataTableFilterBox } from "../../ui/table/data-table-filter-box";
import { DataTableResetFilter } from "../../ui/table/data-table-reset-filter";
import { DataTableSearch } from "../../ui/table/data-table-search";
import {
  USER_TYPE_OPTIONS,
  useUserTableFilters,
  VERIFIED_OPTIONS,
} from "./use-user-table-filters";

export default function UserTableAction() {
  const {
    typeFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    isVerifiedFilter,
    searchQuery,
    setSearchQuery,
  } = useUserTableFilters();
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
    </div>
  );
}
