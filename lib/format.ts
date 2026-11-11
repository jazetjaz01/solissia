import type { Locale } from "@/lib/i18n";

// No server dependency: usable in client components too.
const formatters: Record<Locale, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }),
  en: new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Europe/Paris" }),
};

export const formatDate = (date: string | null, locale: Locale) =>
  date ? formatters[locale].format(new Date(date)) : "";

// Initials of a name, shown when an author has no photo.
export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// "Agrumes du Maroc : la saison 2026" → "agrumes-du-maroc-la-saison-2026"
export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
