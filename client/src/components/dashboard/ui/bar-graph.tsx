import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/src/components/ui/chart";

import { useSuspenseQuery } from "@tanstack/react-query";
import { makeAxiosRequest } from "@/src/lib/utils";

// Chart configuration
const chartConfig = {
  desktop: {
    label: "Desktop Sales",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile Sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BarGraph() {
  // Fetch analytics data
  const { data: analyticsData } = useSuspenseQuery({
    queryKey: ["stripeAnalytics"],
    queryFn: async () => {
      const response = await makeAxiosRequest("get", "/analytics/stripe");
      return response;
    },
  });

  const [activeChart, setActiveChart] = React.useState<"desktop" | "mobile">(
    "desktop"
  );

  // Calculate totals
  const total = {
    desktop: analyticsData.salesByPlatform.desktop,
    mobile: analyticsData.salesByPlatform.mobile,
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Stripe Sales Analytics</CardTitle>
          <CardDescription>
            Sales overview for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {(["desktop", "mobile"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                ${total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={analyticsData.dailySales}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>

        {/* Additional Insights */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              ${analyticsData.monthlyTotals.totalRevenue.toLocaleString()}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>{analyticsData.monthlyTotals.totalSales}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg. Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              ${analyticsData.monthlyTotals.averageOrderValue.toLocaleString()}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
