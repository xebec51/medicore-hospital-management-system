import type { Locale } from "./locales";

const intlLocales: Record<Locale, string> = {
  en: "en-US",
  id: "id-ID",
};

// Every date/time render is pinned to a fixed timezone instead of the
// runtime's ambient one. Vercel's server runs in UTC while a visitor's
// browser runs in their own local zone -- letting the format depend on the
// ambient zone means the server-rendered HTML and the client's hydrated
// re-render can disagree on the wall-clock value for the same instant,
// which React reports as a hydration mismatch.
const APP_TIME_ZONE = "Asia/Jakarta";

function toDate(date: Date | string | number): Date {
  return typeof date === "string" || typeof date === "number" ? new Date(date) : date;
}

function dateParts(date: Date, locale: Locale, options: Intl.DateTimeFormatOptions): Record<string, string> {
  const formatted = new Intl.DateTimeFormat(intlLocales[locale], { ...options, timeZone: APP_TIME_ZONE }).formatToParts(
    date,
  );
  return Object.fromEntries(formatted.map((part) => [part.type, part.value]));
}

export function formatDate(
  date: Date | string | number,
  locale: Locale,
  style: "medium" | "long" | "monthDay" = "medium",
): string {
  const value = toDate(date);
  if (style === "long") {
    const p = dateParts(value, locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
  }
  if (style === "monthDay") {
    const p = dateParts(value, locale, { day: "numeric", month: "short" });
    return `${p.day} ${p.month}`;
  }
  const p = dateParts(value, locale, { day: "numeric", month: "short", year: "numeric" });
  return `${p.day} ${p.month} ${p.year}`;
}

export function formatDateTime(date: Date | string | number, locale: Locale): string {
  const value = toDate(date);
  const p = dateParts(value, locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  return `${p.day} ${p.month} ${p.year}, ${p.hour}:${p.minute}`;
}

export function formatTime(date: Date | string | number, locale: Locale): string {
  const value = toDate(date);
  const p = dateParts(value, locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${p.hour}:${p.minute}`;
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
