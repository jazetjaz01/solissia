import Link from "next/link";
import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";
import { buttonVariants } from "@/components/ui/button";
import { getClaims } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

// Reads the session cookie: render inside <Suspense>.
export const AuthButtons = async () => {
  const locale = await getLocale();
  const { nav } = await getDictionary();
  const claims = await getClaims();

  if (claims) {
    return (
      <Link href={`/${locale}/account`} className={buttonVariants()}>
        {nav.account}
      </Link>
    );
  }

  return (
    <>
      <Link
        href={`/${locale}/login`}
        className={cn(buttonVariants({ variant: "outline" }), "hidden text-foreground sm:inline-flex")}
      >
        {nav.signIn}
      </Link>
      <Link href={`/${locale}/signup`} className={buttonVariants()}>
        {nav.signUp}
      </Link>
    </>
  );
};
