import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { getClaims } from "@/lib/supabase/server";
import { logout } from "../auth/actions";
import { getDictionary, getLocale } from "../dictionaries";

// Not useful in search results.
export async function generateMetadata(): Promise<Metadata> {
  const { auth } = await getDictionary();
  return { title: auth.account.title, robots: noIndex };
}

// Reads the session cookie, so it renders at request time.
async function AccountDetails() {
  const locale = await getLocale();
  const { auth } = await getDictionary();
  const claims = await getClaims();

  return (
    <div className="space-y-6">
      <p className="text-center">
        {auth.account.signedInAs}{" "}
        <span className="font-medium">{claims?.email}</span>
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href={`/${locale}/update-password`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {auth.account.changePassword}
        </Link>
        <form action={logout}>
          <input type="hidden" name="lang" value={locale} />
          <Button type="submit" size="lg" className="w-full">
            {auth.account.logout}
          </Button>
        </form>
      </div>
    </div>
  );
}

// The proxy redirects visitors without a session to the login page.
export default async function AccountPage() {
  const { auth } = await getDictionary();

  return (
    <AuthCard title={auth.account.title}>
      <Suspense fallback={<div className="h-32" />}>
        <AccountDetails />
      </Suspense>
    </AuthCard>
  );
}
