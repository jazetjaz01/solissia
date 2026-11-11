import { UserRound } from "lucide-react";
import Link from "next/link";
import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";
import { getClaims } from "@/lib/supabase/server";

// Reads the session cookie: render inside <Suspense>.
// Profile icon: login page when signed out (it links to signup), account page when signed in.
export const AuthButtons = async () => {
  const locale = await getLocale();
  const { nav } = await getDictionary();
  const claims = await getClaims();

  const label = claims ? nav.account : nav.signIn;

  return (
    <Link
      href={`/${locale}/${claims ? "account" : "login"}`}
      aria-label={label}
      title={label}
      className="relative flex size-9 items-center justify-center rounded-lg outline-none transition-colors hover:bg-black/5 focus-visible:ring-3 focus-visible:ring-ring/50 group-data-[transparent=true]/navbar:hover:bg-white/15"
    >
      <UserRound className="size-5" strokeWidth={1.5} />
      {claims && (
        // Signed-in indicator.
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-300 ring-2 ring-background group-data-[transparent=true]/navbar:ring-transparent" />
      )}
    </Link>
  );
};
