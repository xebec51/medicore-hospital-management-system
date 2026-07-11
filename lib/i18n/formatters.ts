import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import type { Locale } from "./locales";

const dateFnsLocales = {
  en: enUS,
  id: idLocale,
} as const;

const intlLocales: Record<Locale, string> = {
  en: "en-US",
  id: "id-ID",
};

export function formatDate(date: Date | string | number, locale: Locale, pattern = "d MMM yyyy"): string {
  const value = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return format(value, pattern, { locale: dateFnsLocales[locale] });
}

export function formatDateTime(date: Date | string | number, locale: Locale): string {
  return formatDate(date, locale, "d MMM yyyy, HH:mm");
}

export function formatTime(date: Date | string | number, locale: Locale): string {
  return formatDate(date, locale, "HH:mm");
}

export function formatCurrency(amount: number | string, locale: Locale): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat(intlLocales[locale], {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocales[locale]).format(value);
}
