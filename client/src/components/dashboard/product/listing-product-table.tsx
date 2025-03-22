import { DataTableSkeleton } from "./table/data-table-skeleton";
import { DataTable as ProductTable } from "@/src/components/dashboard/product/table/data-table";
import { columns } from "./product-tables/columns";
import { useGetProducts } from "@/src/react-query-hooks/use-get-products";

type ProductListingPage = {
  searchParams: URLSearchParams;
};

export default function ProductListingPage({
  searchParams,
}: ProductListingPage) {
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("q") || "";
  const limit = searchParams.get("limit") || "10";
  const categories = searchParams.get("categories") || "";

  const { data, isLoading } = useGetProducts({
    category: categories,
    limit,
    page,
    search,
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={10} />;
  }
  console.log(data);

  return (
    <ProductTable
      columns={columns}
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
