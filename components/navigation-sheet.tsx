import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";

export const NavigationSheet = async () => {
  const locale = await getLocale();
  const { nav } = await getDictionary();

  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>{nav.menuTitle}</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger render={<Button size="icon" variant="outline" className="text-foreground" />}><Menu /></SheetTrigger>
      <SheetContent className="px-6 py-3">
        <Logo />
        <NavMenu labels={nav} locale={locale} className="mt-6 [&>div]:h-full" orientation="vertical" />
      </SheetContent>
    </Sheet>
  );
};
