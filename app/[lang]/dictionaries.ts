import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale } from "@/lib/i18n";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["fr"]>>;

export const getLocale = async () => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
};

export const getDictionary = async () => dictionaries[await getLocale()]();
