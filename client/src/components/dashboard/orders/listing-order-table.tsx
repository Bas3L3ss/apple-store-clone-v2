import { DataTableSkeleton } from "../ui/table/data-table-skeleton";
import { DataTable as OrdersTable } from "@/src/components/dashboard/ui/table/data-table";
import { columns } from "./orders-tables/columns";
import { useGetAllOrders } from "@/src/react-query-hooks/admin/use-get-all-orders";

type ProductListingPage = {
  searchParams: URLSearchParams;
};

export default function OrderListingPage({ searchParams }: ProductListingPage) {
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("q") || "";
  const limit = searchParams.get("limit") || "10";
  const status = searchParams.get("status") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";

  const { data, isLoading } = useGetAllOrders({
    status,
    limit,
    page,
    search,
    paymentMethod,
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={10} />;
  }

  return (
    <OrdersTable
      columns={columns}
      // @ts-expect-error: no prob
      data={
        data || {
          data: [],
          pagination: {
            currentPage: 0,
            limit: limit,
            total: 0,
            totalPages: 0,
          },
          success: false,
        }
      }
      totalItems={data?.pagination.total || 0}
    />
  );
}
