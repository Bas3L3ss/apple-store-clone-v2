import { DataTableSkeleton } from "../ui/table/data-table-skeleton";
import { DataTable as UserTable } from "@/src/components/dashboard/ui/table/data-table";
import { columns } from "./users-tables/columns";
import { useGetUsers } from "@/src/react-query-hooks/admin/use-get-users";

type ProductListingPage = {
  searchParams: URLSearchParams;
};

export default function UsersListingPage({ searchParams }: ProductListingPage) {
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("q") || "";
  const limit = searchParams.get("limit") || "10";
  const type = searchParams.get("type") || "";
  const isVerified = searchParams.get("isVerified") || "";

  const { data, isLoading } = useGetUsers({
    type,
    limit,
    page,
    search,
    isVerified,
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={10} />;
  }

  return (
    <UserTable
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
