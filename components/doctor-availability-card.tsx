import { CalendarClock, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoctorAvailabilityCardProps {
  name: string;
  specialization: string;
  department: string;
  roomNumber?: string | null;
  schedule?: { startTime: string; endTime: string; quota: number } | null;
  bookedToday: number;
  className?: string;
}

export function DoctorAvailabilityCard({
  name,
  specialization,
  department,
  roomNumber,
  schedule,
  bookedToday,
  className,
}: DoctorAvailabilityCardProps) {
  const isAvailableToday = !!schedule;
  const isFull = schedule ? bookedToday >= schedule.quota : false;

  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card p-4 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {specialization} · {department}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            !isAvailableToday && "bg-muted text-muted-foreground",
            isAvailableToday && !isFull && "bg-success/15 text-success",
            isAvailableToday && isFull && "bg-warning/20 text-warning-foreground",
          )}
        >
          {!isAvailableToday ? "Off today" : isFull ? "Fully booked" : "Available"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {schedule ? (
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5" />
            {schedule.startTime}–{schedule.endTime} · {bookedToday}/{schedule.quota} booked
          </span>
        ) : null}
        {roomNumber ? (
          <span className="flex items-center gap-1.5">
            <DoorOpen className="size-3.5" />
            Room {roomNumber}
          </span>
        ) : null}
      </div>
    </div>
  );
}
