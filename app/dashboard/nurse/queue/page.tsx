import { listNurseQueueToday } from "@/lib/queries/nurse";
import { EmptyState } from "@/components/empty-state";
import { NurseQueueItem } from "@/components/nurse/nurse-queue-item";

export default async function NurseQueuePage() {
  const queue = await listNurseQueueToday();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Today&apos;s queue</h1>
        <p className="text-sm text-muted-foreground">Checked-in patients waiting for or currently in consultation.</p>
      </div>

      {queue.length ? (
        <div className="space-y-2.5">
          {queue.map((appointment) => (
            <NurseQueueItem key={appointment.id} appointment={appointment} />
          ))}
        </div>
      ) : (
        <EmptyState title="No patients waiting" description="Checked-in patients will appear here for vital signs." />
      )}
    </div>
  );
}
