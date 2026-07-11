import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function DateRangeFilterForm({ defaultFrom, defaultTo }: { defaultFrom: Date; defaultTo: Date }) {
  return (
    <form className="flex flex-wrap items-end gap-2" method="GET">
      <div className="space-y-1">
        <label htmlFor="from" className="text-xs text-muted-foreground">
          From
        </label>
        <Input id="from" name="from" type="date" defaultValue={toDateInputValue(defaultFrom)} className="h-8" />
      </div>
      <div className="space-y-1">
        <label htmlFor="to" className="text-xs text-muted-foreground">
          To
        </label>
        <Input id="to" name="to" type="date" defaultValue={toDateInputValue(defaultTo)} className="h-8" />
      </div>
      <Button type="submit" size="sm">
        <Filter className="size-4" />
        Apply
      </Button>
    </form>
  );
}
