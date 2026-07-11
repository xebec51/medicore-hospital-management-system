import { CardGridSkeleton, TableSkeleton } from "@/components/loading-state";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-40 animate-pulse rounded-3xl bg-muted/40" />
      <CardGridSkeleton />
      <TableSkeleton />
    </div>
  );
}
