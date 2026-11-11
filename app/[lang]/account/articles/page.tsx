import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { WriterPage } from "@/components/writer/fields";
import { NeedAuthor } from "@/components/writer/need-author";
import { requireWriter } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { format } from "@/lib/i18n";
import { noIndex } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, getLocale } from "../../dictionaries";
import { deleteArticle } from "./actions";
import { DeleteButton } from "./delete-button";

export async function generateMetadata(): Promise<Metadata> {
  const { writer } = await getDictionary();
  return { title: writer.myArticles, robots: noIndex };
}

async function MyArticles() {
  const locale = await getLocale();
  const { writer } = await getDictionary();
  const user = await requireWriter(locale);
  const supabase = await createClient();

  const [{ data: author }, { data: articles }] = await Promise.all([
    supabase.from("authors").select("id").eq("id", user.id).maybeSingle(),
    supabase
      .from("articles")
      .select("id, locale, slug, title, status, published_at, updated_at")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  if (!author) return <NeedAuthor locale={locale} />;

  return (
    <>
      <Link
        href={`/${locale}/account/articles/new`}
        className="mt-8 inline-flex h-12 items-center bg-black px-8 text-sm font-medium uppercase tracking-[0.15em] text-white hover:bg-black/85"
      >
        {writer.newArticle}
      </Link>

      {articles && articles.length > 0 ? (
        <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {articles.map((article) => (
            <li key={article.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-black">
                  <span className="me-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs uppercase">
                    {article.locale}
                  </span>
                  {article.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {article.status === "published"
                    ? format(writer.list.published, { date: formatDate(article.published_at, locale) })
                    : format(writer.list.draft, { date: formatDate(article.updated_at, locale) })}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {article.status === "published" && (
                  <Link
                    href={`/${article.locale}/actualite/${article.slug}`}
                    className="text-black underline underline-offset-4"
                  >
                    {writer.list.view}
                  </Link>
                )}
                <Link
                  href={`/${locale}/account/articles/${article.id}`}
                  className="text-black underline underline-offset-4"
                >
                  {writer.list.edit}
                </Link>
                <form action={deleteArticle.bind(null, locale, article.id)}>
                  <DeleteButton label={writer.list.delete} confirmMessage={writer.list.confirmDelete} />
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-muted-foreground">{writer.list.empty}</p>
      )}
    </>
  );
}

export default async function MyArticlesPage() {
  const locale = await getLocale();
  const { writer } = await getDictionary();
  return (
    <WriterPage back={{ href: `/${locale}/account`, label: writer.backToAccount }} title={writer.myArticles}>
      <Suspense fallback={<p className="mt-10 text-muted-foreground">{writer.loading}</p>}>
        <MyArticles />
      </Suspense>
    </WriterPage>
  );
}
