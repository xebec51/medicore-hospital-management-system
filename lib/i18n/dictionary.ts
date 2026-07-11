import en from "./dictionaries/en";
import id from "./dictionaries/id";
import type { Locale } from "./locales";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Dictionary = typeof en;

const dictionaries: Record<Locale, DeepPartial<Dictionary>> = {
  en,
  id,
};

function getPath(source: unknown, path: string[]): unknown {
  let cursor: unknown = source;
  for (const segment of path) {
    if (cursor == null || typeof cursor !== "object") return undefined;
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return cursor;
}

/**
 * Resolves a dot-notation key against the active locale, falling back to
 * English, then finally to the raw key so missing translations never crash the UI.
 */
export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const path = key.split(".");
  const localized = getPath(dictionaries[locale], path);
  const fallback = getPath(dictionaries.en, path);
  const value = localized ?? fallback ?? key;
  const text = typeof value === "string" ? value : key;

  if (!vars) return text;
  return Object.entries(vars).reduce(
    (acc, [varName, varValue]) => acc.replaceAll(`{${varName}}`, String(varValue)),
    text,
  );
}

export function getDictionary(locale: Locale): DeepPartial<Dictionary> {
  return dictionaries[locale];
}
