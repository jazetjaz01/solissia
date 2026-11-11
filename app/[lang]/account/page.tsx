import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
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
  const { auth, writer } = await getDictionary();
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <p className="text-center">
        {auth.account.signedInAs}{" "}
        <span className="font-medium">{user?.email}</span>
      </p>
      {user?.role === "writer" && (
        <nav aria-label={writer.section} className="grid gap-3 border-y border-black/10 py-6">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50">{writer.section}</p>
          <Link
            href={`/${locale}/account/articles/new`}
            className={buttonVariants({ size: "lg", className: "bg-amber-300 text-black hover:bg-amber-400" })}
          >
            <PenLine data-icon="inline-start" />
            {writer.newArticle}
          </Link>
          <div className="flex justify-center gap-6 text-sm">
            <Link href={`/${locale}/account/articles`} className="underline underline-offset-4">
              {writer.myArticles}
            </Link>
            <Link href={`/${locale}/account/author`} className="underline underline-offset-4">
              {writer.authorProfile}
            </Link>
          </div>
        </nav>
      )}
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
