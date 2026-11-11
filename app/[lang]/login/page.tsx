import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";
import { login } from "../auth/actions";
import { getDictionary, getLocale } from "../dictionaries";

export default async function LoginPage() {
  const locale = await getLocale();
  const { auth } = await getDictionary();

  return (
    <AuthCard
      title={auth.login.title}
      footer={
        <>
          <p>
            <Link href={`/${locale}/forgot-password`} className="underline underline-offset-4">
              {auth.login.forgot}
            </Link>
          </p>
          <p>
            {auth.login.noAccount}{" "}
            <Link href={`/${locale}/signup`} className="font-medium text-foreground underline underline-offset-4">
              {auth.login.signupLink}
            </Link>
          </p>
        </>
      }
    >
      <AuthForm
        action={login}
        lang={locale}
        submitLabel={auth.login.submit}
        errors={auth.errors}
        fields={[
          { name: "email", label: auth.email, type: "email", autoComplete: "email" },
          { name: "password", label: auth.password, type: "password", autoComplete: "current-password" },
        ]}
      />
    </AuthCard>
  );
}
