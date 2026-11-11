import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";
import { signup } from "../auth/actions";
import { getDictionary, getLocale } from "../dictionaries";

export default async function SignupPage() {
  const locale = await getLocale();
  const { auth } = await getDictionary();

  return (
    <AuthCard
      title={auth.signup.title}
      footer={
        <p>
          {auth.signup.hasAccount}{" "}
          <Link href={`/${locale}/login`} className="font-medium text-foreground underline underline-offset-4">
            {auth.signup.loginLink}
          </Link>
        </p>
      }
    >
      <AuthForm
        action={signup}
        lang={locale}
        submitLabel={auth.signup.submit}
        successMessage={auth.signup.success}
        errors={auth.errors}
        fields={[
          { name: "email", label: auth.email, type: "email", autoComplete: "email" },
          {
            name: "password",
            label: auth.password,
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
