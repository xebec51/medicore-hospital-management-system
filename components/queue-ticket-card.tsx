import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

interface QueueTicketCardProps {
  queueNumber: number;
  patientName: string;
  mrn: string;
  time: string;
  status: string;
  reason?: string | null;
  actions?: React.ReactNode;
  className?: string;
}

export function QueueTicketCard({
  queueNumber,
  patientName,
  mrn,
  time,
  status,
  reason,
  actions,
  className,
}: QueueTicketCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-3 shadow-sm",
        className,
      )}
    >
      <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="text-[10px] leading-none font-medium uppercase">No.</span>
        <span className="text-base leading-tight font-bold tabular-nums">{queueNumber}</span>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{patientName}</p>
          <StatusBadge status={status} domain="AppointmentStatus" />
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {mrn} · {time}
          {reason ? ` · ${reason}` : ""}
        </p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
    </div>
  );
}
