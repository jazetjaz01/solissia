import type { Metadata } from "next";
import { Suspense } from "react";
import { WriterPage } from "@/components/writer/fields";
import { NeedAuthor } from "@/components/writer/need-author";
import { getCategories } from "@/lib/articles";
import { requireWriter } from "@/lib/auth";
import { noIndex } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, getLocale } from "../../../dictionaries";
import { ArticleForm } from "../article-form";

export async function generateMetadata(): Promise<Metadata> {
  const { writer } = await getDictionary();
  return { title: writer.newArticle, robots: noIndex };
}

async function NewArticleForm() {
  const locale = await getLocale();
  const { writer } = await getDictionary();
  const user = await requireWriter(locale);
  const supabase = await createClient();
  const [{ data: author }, categories] = await Promise.all([
    supabase.from("authors").select("id").eq("id", user.id).maybeSingle(),
    getCategories(locale),
  ]);
  if (!author) return <NeedAuthor locale={locale} />;

  return <ArticleForm lang={locale} userId={user.id} categories={categories} t={writer} />;
}

export default async function NewArticlePage() {
  const locale = await getLocale();
  const { writer } = await getDictionary();
  return (
    <WriterPage back={{ href: `/${locale}/account/articles`, label: writer.backToArticles }} title={writer.newArticle}>
      <Suspense fallback={<p className="mt-10 text-muted-foreground">{writer.loading}</p>}>
        <NewArticleForm />
      </Suspense>
    </WriterPage>
  );
}
