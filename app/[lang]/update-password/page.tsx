import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";
import { updatePassword } from "../auth/actions";
import { getDictionary, getLocale } from "../dictionaries";

// Reached from the password reset email; the proxy requires a session.
export default async function UpdatePasswordPage() {
  const locale = await getLocale();
  const { auth, nav } = await getDictionary();

  return (
    <AuthCard
      title={auth.update.title}
      footer={
        <p>
          <Link href={`/${locale}/account`} className="underline underline-offset-4">
            {nav.account}
          </Link>
        </p>
      }
    >
      <AuthForm
        action={updatePassword}
        lang={locale}
        submitLabel={auth.update.submit}
        successMessage={auth.update.success}
        errors={auth.errors}
        fields={[
          {
            name: "password",
            label: auth.newPassword,
            type: "password",
            autoComplete: "new-password",
            hint: auth.signup.passwordHint,
            minLength: 8,
          },
        ]}
      />
    </AuthCard>
  );
}
