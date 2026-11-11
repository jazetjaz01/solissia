import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";
import { Suspense } from "react";
import { AuthButtons } from "@/components/auth-buttons";
import { LanguageSwitcher, LanguageSwitcherFallback } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { NavbarFrame, NavbarShell } from "@/components/navbar-shell";

const Navbar = async () => {
  const locale = await getLocale();
  const { nav } = await getDictionary();

  const content = (
      <nav className="h-full">
        <div className="mx-auto flex h-full max-w-(--breakpoint-2xl) items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu labels={nav} locale={locale} className="hidden md:block group-data-[transparent=true]/navbar:[&_a:hover]:bg-white/15 group-data-[transparent=true]/navbar:[&_a:focus]:bg-white/15" />

          <div className="flex items-center gap-3">
            <Suspense fallback={<LanguageSwitcherFallback current={locale} />}>
              <LanguageSwitcher current={locale} label={nav.languageLabel} />
            </Suspense>
            <Suspense>
              <AuthButtons />
            </Suspense>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
  );

  // The shell reads the page address. On pages prerendered before their
  // address is known (e.g. articles published after the build), the white
  // frame is shown until the request comes in.
  return (
    <Suspense fallback={<NavbarFrame transparent={false}>{content}</NavbarFrame>}>
      <NavbarShell>{content}</NavbarShell>
    </Suspense>
  );
};

export default Navbar;
