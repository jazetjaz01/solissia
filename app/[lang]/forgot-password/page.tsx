import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";
import { requestPasswordReset } from "../auth/actions";
import { getDictionary, getLocale } from "../dictionaries";

// Not useful in search results.
export async function generateMetadata(): Promise<Metadata> {
  const { auth } = await getDictionary();
  return { title: auth.forgot.title, robots: noIndex };
}

export default async function ForgotPasswordPage() {
  const locale = await getLocale();
  const { auth } = await getDictionary();

  return (
    <AuthCard
      title={auth.forgot.title}
      intro={auth.forgot.intro}
      footer={
        <p>
          <Link href={`/${locale}/login`} className="underline underline-offset-4">
            {auth.forgot.backToLogin}
          </Link>
        </p>
      }
    >
      <AuthForm
        action={requestPasswordReset}
        lang={locale}
        submitLabel={auth.forgot.submit}
        successMessage={auth.forgot.success}
        errors={auth.errors}
        fields={[{ name: "email", label: auth.email, type: "email", autoComplete: "email" }]}
      />
    </AuthCard>
  );
}
