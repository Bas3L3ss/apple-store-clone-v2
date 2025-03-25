import { Suspense } from "react";
import { BarGraph } from "../ui/bar-graph";
import { BarGraphSkeleton } from "../ui/bar-graph-skeleton";
export default function BarStats() {
  return (
    <Suspense fallback={<BarGraphSkeleton />}>
      <BarGraph />
    </Suspense>
  );
}
