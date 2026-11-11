import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { getDictionary, getLocale } from "../../dictionaries";

export default async function AuthErrorPage() {
  const locale = await getLocale();
  const { auth } = await getDictionary();

  return (
    <AuthCard
      title={auth.confirmError.title}
      intro={auth.confirmError.text}
      footer={
        <p>
          <Link href={`/${locale}/login`} className="font-medium text-foreground underline underline-offset-4">
            {auth.confirmError.backToLogin}
          </Link>
        </p>
      }
    >
      {null}
    </AuthCard>
  );
}
