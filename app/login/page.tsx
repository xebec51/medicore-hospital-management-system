import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LoginSidePanel } from "@/components/auth/login-side-panel";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <LoginSidePanel />

      <div className="relative flex flex-col items-center justify-center px-6 py-16">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher variant="outline" />
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
