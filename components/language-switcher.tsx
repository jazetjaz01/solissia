"use client";

import { Menu } from "@base-ui/react/menu";
import { Globe } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { localeCookie, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Each language is written in its own language, as on most multilingual sites.
const languageNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
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
    <Menu.Root>
      <Menu.Trigger
        aria-label={`${label} : ${languageNames[current]}`}
        className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-medium uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Globe className="size-5" strokeWidth={1.5} />
        {current}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={10} className="z-50">
          <Menu.Popup className="rounded-2xl bg-white px-3 py-3 text-black shadow-lg ring-1 ring-black/5 outline-none">
            <Menu.Arrow className="size-3 rotate-45 bg-white data-[side=bottom]:-top-1.5" />
            {locales.map((locale) => (
              <Menu.LinkItem
                key={locale}
                closeOnClick
                render={<NextLink href={hrefFor(locale)} />}
                hrefLang={locale}
                lang={locale}
                aria-current={locale === current ? "true" : undefined}
                onClick={() => {
                  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
                }}
                className={cn(
                  "block rounded-full px-4 py-1 text-center text-sm uppercase tracking-wide outline-none",
                  locale === current
                    ? "bg-amber-300"
                    : "data-highlighted:bg-muted",
                )}
              >
                {languageNames[locale]}
              </Menu.LinkItem>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};
