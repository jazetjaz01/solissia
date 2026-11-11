import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WriterPage } from "@/components/writer/fields";
import { getCategories } from "@/lib/articles";
import { requireWriter } from "@/lib/auth";
import { noIndex } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, getLocale } from "../../../dictionaries";
import { ArticleForm, type ArticleValues } from "../article-form";

export async function generateMetadata(): Promise<Metadata> {
  const { writer } = await getDictionary();
  return { title: writer.editArticle, robots: noIndex };
}

async function EditArticleForm(props: PageProps<"/[lang]/account/articles/[id]">) {
  const locale = await getLocale();
  const { writer } = await getDictionary();
  const user = await requireWriter(locale);
  const { id } = await props.params;
  // Not a UUID: no need to ask the database.
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: article }, categories] = await Promise.all([
    supabase
      .from("articles")
      .select("id, locale, title, slug, excerpt, content, category_id, cover_image_url, status")
      .eq("id", id)
      .eq("author_id", user.id)
      .maybeSingle<ArticleValues>(),
    getCategories(locale),
  ]);
  if (!article) notFound();

  return <ArticleForm lang={locale} userId={user.id} categories={categories} article={article} t={writer} />;
}

export default async function EditArticlePage(props: PageProps<"/[lang]/account/articles/[id]">) {
  const locale = await getLocale();
  const { writer } = await getDictionary();
  return (
    <WriterPage back={{ href: `/${locale}/account/articles`, label: writer.backToArticles }} title={writer.editArticle}>
      {/* params is read inside Suspense (the article id is only known at request time). */}
      <Suspense fallback={<p className="mt-10 text-muted-foreground">{writer.loading}</p>}>
        <EditArticleForm {...props} />
      </Suspense>
    </WriterPage>
  );
}
