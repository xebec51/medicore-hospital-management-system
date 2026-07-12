"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserStatus } from "@/lib/actions/users";
import type { UserListItem } from "@/lib/queries/users";

const STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

export function UserStatusMenu({ user }: { user: UserListItem }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function handleStatusChange(status: (typeof STATUSES)[number]) {
    startTransition(async () => {
      const result = await updateUserStatus({ id: user.id, status });
      if (result.success) {
        toast.success(`${user.name}'s status is now ${status.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" disabled={isPending} aria-label="Change status" />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Change status</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {STATUSES.filter((status) => status !== user.status).map((status) => (
          <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)}>
            Set as {status.charAt(0) + status.slice(1).toLowerCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
