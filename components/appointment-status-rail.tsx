import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { status: "SCHEDULED", label: "Scheduled" },
  { status: "CHECKED_IN", label: "Checked in" },
  { status: "IN_CONSULTATION", label: "In consultation" },
  { status: "COMPLETED", label: "Completed" },
] as const;

export function AppointmentStatusRail({ status, className }: { status: string; className?: string }) {
  const isTerminalOutlier = status === "CANCELLED" || status === "NO_SHOW";
  const currentIndex = STEPS.findIndex((step) => step.status === status);

  if (isTerminalOutlier) {
    return (
      <div className={cn("rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive", className)}>
        {status === "CANCELLED" ? "This appointment was cancelled." : "The patient did not show up."}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      {STEPS.map((step, index) => {
        const isDone = currentIndex > index;
        const isCurrent = currentIndex === index;
        return (
          <div key={step.status} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  isDone && "border-success bg-success text-success-foreground",
                  isCurrent && "border-primary bg-primary/10 text-primary",
                  !isDone && !isCurrent && "border-border text-muted-foreground",
                )}
              >
                {isDone ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-medium",
                  (isDone || isCurrent) && "text-foreground",
                  !isDone && !isCurrent && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div className={cn("mx-2 h-0.5 flex-1 rounded-full", isDone ? "bg-success" : "bg-border")} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
