"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { localeCookie, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const FlagFr = () => (
  <svg viewBox="0 0 3 2" className="h-full w-full">
    <path fill="#002654" d="M0 0h1v2H0z" />
    <path fill="#fff" d="M1 0h1v2H1z" />
    <path fill="#ce1126" d="M2 0h1v2H2z" />
  </svg>
);

const FlagGb = () => {
  const id = useId();
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <clipPath id={`${id}-s`}>
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id={`${id}-t`}>
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <g clipPath={`url(#${id}-s)`}>
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#${id}-t)`} stroke="#c8102e" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  );
};

const languages: Record<Locale, { name: string; Flag: () => React.ReactElement }> = {
  fr: { name: "Français", Flag: FlagFr },
  en: { name: "English", Flag: FlagGb },
};

export const LanguageSwitcher = ({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) => {
  const pathname = usePathname();

  // Same page in the other language: /fr/contact -> /en/contact
  const hrefFor = (locale: Locale) =>
    pathname.replace(/^\/[^/]+/, `/${locale}`) || `/${locale}`;

  return (
    <ul aria-label={label} className="flex items-center gap-2">
      {locales.map((locale) => {
        const { name, Flag } = languages[locale];
        const active = locale === current;
        return (
          <li key={locale}>
            <Link
              href={hrefFor(locale)}
              hrefLang={locale}
              lang={locale}
              aria-label={name}
              aria-current={active ? "true" : undefined}
              title={name}
              onClick={() => {
                document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
              }}
              className={cn(
                "block h-5 w-7 overflow-hidden rounded-sm ring-1 ring-black/10 transition-opacity",
                active
                  ? "ring-2 ring-current"
                  : "opacity-50 hover:opacity-100 focus-visible:opacity-100",
              )}
            >
              <Flag />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
