"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useI18n } from "@/lib/i18n/use-i18n";
import { roleIcons, demoAccountEmails, DEMO_PASSWORD } from "@/lib/constants/role-icons";
import { ROLES } from "@/lib/constants/roles";

type LoginError = "invalidCredentials" | "accountInactive" | "genericError" | null;

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<LoginError>(null);

  function fillDemoAccount(role: (typeof ROLES)[number]) {
    setEmail(demoAccountEmails[role]);
    setPassword(DEMO_PASSWORD);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn("credentials", { redirect: false, email, password });

      if (result?.error === "ACCOUNT_INACTIVE") {
        setError("accountInactive");
      } else if (result?.error) {
        setError("invalidCredentials");
      } else if (result?.ok) {
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
        router.refresh();
        return;
      }
    } catch {
      setError("genericError");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">{t("auth.loginTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{t(`auth.${error}`)}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          {isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">{t("auth.demoAccounts")}</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <p className="text-center text-xs text-muted-foreground">{t("auth.demoAccountsHint")}</p>
        <div className="grid grid-cols-4 gap-2">
          {ROLES.map((role) => {
            const Icon = roleIcons[role];
            const isSelected = email === demoAccountEmails[role];
            return (
              <button
                key={role}
                type="button"
                onClick={() => fillDemoAccount(role)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[11px] font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {t(`roles.${role}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
