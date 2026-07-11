import { listActivityLogs } from "@/lib/queries/activity-logs";
import { ActivityFeed } from "@/components/activity-feed";

export default async function AdminActivityLogsPage() {
  const logs = await listActivityLogs(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity Logs</h1>
        <p className="text-sm text-muted-foreground">A hospital-wide audit trail of actions across every module.</p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <ActivityFeed
          items={logs}
          emptyTitle="No activity recorded yet"
          emptyDescription="Actions across the platform will appear here as they happen."
        />
      </div>
    </div>
  );
}
