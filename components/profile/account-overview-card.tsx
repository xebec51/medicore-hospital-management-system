"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, Pencil, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StatusBadge } from "@/components/status-badge";
import { updateOwnAccount } from "@/lib/actions/profile";
import { updateAccountSchema } from "@/lib/validations/profile";
import { formatDate } from "@/lib/i18n/formatters";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { OwnAccount } from "@/lib/queries/users";

interface AccountFormValues {
  name: string;
  phone: string;
  avatarUrl: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AccountOverviewCard({ account }: { account: OwnAccount }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(updateAccountSchema) as never,
    defaultValues: {
      name: account.name,
      phone: account.phone ?? "",
      avatarUrl: account.avatarUrl ?? "",
    },
  });

  async function onSubmit(values: AccountFormValues) {
    const result = await updateOwnAccount(values);
    if (result.success) {
      toast.success(t("profile.accountUpdated"));
      setIsEditing(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{t("profile.editAccount")}</CardTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("common.cancel")}
            onClick={() => {
              form.reset();
              setIsEditing(false);
            }}
          >
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{t("common.name")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common.phone")} <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+62 812 3456 7890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("profile.avatarUrl")} <span className="text-muted-foreground">({t("common.optional")})</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://…" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsEditing(false);
                  }}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  {t("common.save")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            {account.avatarUrl ? (
              <AvatarImage src={account.avatarUrl} alt={account.name} referrerPolicy="no-referrer" />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
              {initials(account.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{account.name}</CardTitle>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3.5" />
              {account.email}
            </p>
          </div>
        </div>
        <Button variant="outline" size="icon-sm" aria-label={t("profile.editAccount")} onClick={() => setIsEditing(true)}>
          <Pencil className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 border-t border-border/60 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("profile.role")}</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {t(`roles.${account.role}`)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("common.phone")}</span>
          <span>{account.phone || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("profile.accountStatus")}</span>
          <StatusBadge status={account.status} domain="UserStatus" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("profile.memberSince")}</span>
          <span>{formatDate(account.createdAt, locale)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
