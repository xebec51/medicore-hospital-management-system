import { LoadingState } from "@/components/loading-state";

export default function RootLoading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LoadingState label="Loading MediCore…" />
    </div>
  );
}
