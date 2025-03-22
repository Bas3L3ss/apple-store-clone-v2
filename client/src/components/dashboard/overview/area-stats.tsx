import { useEffect, useState } from "react";
import { AreaGraphSkeleton } from "../ui/area-graph-skeleton";
import { AreaGraph } from "../ui/area-graph";

export default function AreaStats() {
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
    return <AreaGraphSkeleton />;
  }
  return <AreaGraph />;
}
