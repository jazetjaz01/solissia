import type { Metadata } from "next";
import { Suspense } from "react";
import { WriterPage } from "@/components/writer/fields";
import { requireWriter } from "@/lib/auth";
import { noIndex } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, getLocale } from "../../dictionaries";
import { AuthorForm } from "./author-form";

export async function generateMetadata(): Promise<Metadata> {
  const { writer } = await getDictionary();
  return { title: writer.authorProfile, robots: noIndex };
}

async function AuthorEditor() {
  const locale = await getLocale();
  const { writer } = await getDictionary();
  const user = await requireWriter(locale);
  const supabase = await createClient();
  const { data: author } = await supabase
    .from("authors")
    .select("display_name, job_title, bio, avatar_url, linkedin_url, x_url, contact_email")
    .eq("id", user.id)
    .maybeSingle();

  return <AuthorForm lang={locale} userId={user.id} author={author} t={writer} />;
}

export default async function AuthorPage() {
  const locale = await getLocale();
  const { writer } = await getDictionary();
  return (
    <WriterPage
      back={{ href: `/${locale}/account`, label: writer.backToAccount }}
      title={writer.authorProfile}
      intro={writer.author.intro}
    >
      <Suspense fallback={<p className="mt-10 text-muted-foreground">{writer.loading}</p>}>
        <AuthorEditor />
      </Suspense>
    </WriterPage>
  );
}
