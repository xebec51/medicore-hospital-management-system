import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "MediCore — Smart Hospital Management System",
    template: "%s · MediCore",
  },
  description:
    "MediCore is an operational hospital management platform for patient registration, appointments, consultations, pharmacy, and billing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </I18nProvider>
      </body>
    </html>
  );
}
