"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, LogOut, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DashboardSidebar } from "./dashboard-sidebar";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { AppRole } from "@/lib/constants/roles";

interface DashboardHeaderProps {
  role: AppRole;
  userName: string;
  title?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function DashboardHeader({ role, userName, title }: DashboardHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-lg sm:px-6">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0 sm:max-w-72">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <DashboardSidebar role={role} onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setMobileNavOpen(true)}>
        <Menu className="size-5" />
        <span className="sr-only">Open navigation</span>
      </Button>

      <div className="min-w-0 flex-1">
        {title ? <h2 className="truncate text-sm font-medium text-foreground sm:text-base">{title}</h2> : null}
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 transition-colors hover:bg-muted">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials(userName)}
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs font-normal text-muted-foreground">{t(`roles.${role}`)}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
              <UserRound className="size-4" />
              {t("nav.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <Settings className="size-4" />
              {t("nav.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" render={<Link href="/login" />}>
              <LogOut className="size-4" />
              {t("nav.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
