import { useEffect, useState } from "react";
import { BarGraph } from "../ui/bar-graph";
import { BarGraphSkeleton } from "../ui/bar-graph-skeleton";

export default function BarStats() {
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
    return <BarGraphSkeleton />;
  }

  return <BarGraph />;
}
