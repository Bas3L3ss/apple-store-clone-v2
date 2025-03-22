import { useEffect, useState } from "react";
import { BarGraphSkeleton } from "../ui/bar-graph-skeleton";
import { PieGraph } from "../ui/pie-graph";

export default function Stats() {
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
  return <PieGraph />;
}
