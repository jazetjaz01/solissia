// Shared by the proxy, server and client components (no server-only imports).
export const locales = ["fr", "en"] as const;
export const defaultLocale = "fr";
export const localeCookie = "NEXT_LOCALE";

export type Locale = (typeof locales)[number];

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

export const format = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
