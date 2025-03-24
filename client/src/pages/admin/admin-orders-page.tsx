import { Separator } from "@/src/components/ui/separator";
import { useSearchParams } from "react-router-dom";
import { Heading } from "@/src/components/ui/heading";
import OrderTableAction from "@/src/components/dashboard/orders/orders-tables/order-table-action";
import OrderListingPage from "@/src/components/dashboard/orders/listing-order-table";

export default function AdminOrdersPage() {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-start justify-between">
        <Heading title="Orders" description="Manage Orders" />
      </div>
      <Separator />
      <OrderTableAction />

      <OrderListingPage searchParams={searchParams} />
    </div>
  );
}
