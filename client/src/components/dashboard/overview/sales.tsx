import { RecentSalesSkeleton } from "../ui/recent-sales-skeleton";
import { RecentSales } from "../ui/recent-sales";
import { useGetRecentSales } from "@/src/react-query-hooks/admin/use-analytics";

export default function Sales() {
  const { data, isLoading } = useGetRecentSales();

  if (isLoading) {
    return <RecentSalesSkeleton />;
  }
  // @ts-expect-error: no prob

  return <RecentSales data={data} />;
}
