import { useEffect, useState } from "react";
import { RecentSalesSkeleton } from "../ui/recent-sales-skeleton";
import { RecentSales } from "../ui/recent-sales";

export default function Sales() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking a fake API call with a 1000ms delay
    const mockApiCall = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    };

    mockApiCall().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <RecentSalesSkeleton />;
  }
  return <RecentSales />;
}
