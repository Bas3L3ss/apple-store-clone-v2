import { EnrichedSalesResponse } from "@/src/@types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { formatPrice } from "@/src/lib/utils";

export function RecentSales({ data }: { data: EnrichedSalesResponse | null }) {
  const sales = data?.sales;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          You made {data?.monthlySalesCount} sales this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales && sales.length > 0 ? (
            <>
              {sales.map((sale, index) => {
                return (
                  <article key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={sale.customer?.avatar}
                        alt={sale.customer?.username}
                      />
                      <AvatarFallback>
                        {sale.customer?.avatar?.slice(0, 2).toUpperCase() ??
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.customer?.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.customer_email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      +{formatPrice(parseInt(sale.amount), sale.currency)}
                    </div>
                  </article>
                );
              })}
            </>
          ) : (
            "No sales this month"
          )}
        </div>
      </CardContent>
    </Card>
  );
}
