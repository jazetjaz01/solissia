"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { hasLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const NavbarFrame = ({
  transparent,
  children,
}: {
  transparent: boolean;
  children: ReactNode;
}) => (
  <header
    data-transparent={transparent}
    className={cn(
      "group/navbar sticky top-0 z-50 h-16 border-b",
      transparent
        ? "border-transparent bg-transparent text-white"
        : "bg-background text-foreground",
    )}
  >
    {children}
  </header>
);

// Pages (after the language) that open on a full-width banner, like the home page.
const bannerPages = ["cacao", "cafe"];

// Transparent over the home hero image, white once the user scrolls.
// Reads the page address: render inside <Suspense> (fallback: a white NavbarFrame).
export const NavbarShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pages opening on a full-width banner: home (/fr, /en) and the product pages (/fr/cacao, /en/cafe…)
  const segments = pathname.split("/").filter(Boolean);
  const hasBanner =
    hasLocale(segments[0]) &&
    (segments.length === 1 || (segments.length === 2 && bannerPages.includes(segments[1])));
  const transparent = hasBanner && !scrolled;

  return <NavbarFrame transparent={transparent}>{children}</NavbarFrame>;
};
