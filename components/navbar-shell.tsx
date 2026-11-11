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

  // Home page is /fr or /en
  const segments = pathname.split("/").filter(Boolean);
  const isHome = segments.length === 1 && hasLocale(segments[0]);
  const transparent = isHome && !scrolled;

  return <NavbarFrame transparent={transparent}>{children}</NavbarFrame>;
};
