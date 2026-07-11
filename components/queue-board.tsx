import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

interface QueueBoardGroup {
  key: string;
  title: string;
  subtitle?: string;
  tickets: React.ReactNode[];
}

interface QueueBoardProps {
  groups: QueueBoardGroup[];
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function QueueBoard({ groups, emptyTitle, emptyDescription, className }: QueueBoardProps) {
  if (!groups.length) {
    return <EmptyState title={emptyTitle ?? "No queue activity yet"} description={emptyDescription} />;
  }

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      {groups.map((group) => (
        <div key={group.key} className="rounded-2xl border border-border/70 bg-muted/30 p-3">
          <div className="px-1.5 pb-2">
            <p className="text-sm font-semibold">{group.title}</p>
            {group.subtitle ? <p className="text-xs text-muted-foreground">{group.subtitle}</p> : null}
          </div>
          <div className="space-y-2">
            {group.tickets.length ? (
              group.tickets
            ) : (
              <p className="px-1.5 py-4 text-center text-xs text-muted-foreground">No patients in this queue.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
