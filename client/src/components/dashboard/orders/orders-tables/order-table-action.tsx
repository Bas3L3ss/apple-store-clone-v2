import { DataTableFilterBox } from "../../ui/table/data-table-filter-box";
import { DataTableResetFilter } from "../../ui/table/data-table-reset-filter";
import { DataTableSearch } from "../../ui/table/data-table-search";
import {
  ORDER_STATUS,
  useOrderTableFilters,
  PAYMENT_METHOD,
} from "./use-order-table-filters";

export default function OrderTableAction() {
  const {
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    paymentMethodFilter,
    statusFilter,
    setSearchQuery,
  } = useOrderTableFilters();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <DataTableFilterBox
        filterKey="status"
        title="Order Status"
        options={ORDER_STATUS}
        // @ts-expect-error: no prob

        setFilterValue={setCategoriesFilter}
        filterValue={statusFilter}
      />
      <DataTableFilterBox
        filterKey="paymentMethod"
        title="Payment method"
        options={PAYMENT_METHOD}
        // @ts-expect-error: no prob

        setFilterValue={setCategoriesFilter}
        filterValue={paymentMethodFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
