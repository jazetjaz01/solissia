import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { getArticlesPage, getCategories } from "@/lib/articles";
import type { Locale } from "@/lib/i18n";
import { ArticleCard } from "@/components/actualite/article-card";
import { Pagination } from "@/components/actualite/pagination";

// Header, category filter, article grid and pagination.
export async function ArticleList({
  locale,
  categorySlug,
  page = 1,
}: {
  locale: Locale;
  categorySlug?: string;
  page?: number;
}) {
  const [{ blog }, categories, { articles, totalPages }] = await Promise.all([
    getDictionary(),
    getCategories(locale),
    getArticlesPage(locale, categorySlug, page),
  ]);
  // Page past the last one.
  if (page > 1 && articles.length === 0) notFound();

  const current = categories.find((c) => c.slug === categorySlug);
  const listPath = `/${locale}/actualite`;
  const basePath = categorySlug ? `${listPath}/categorie/${categorySlug}` : listPath;

  const filters = [{ href: listPath, label: blog.all, active: !categorySlug }].concat(
    categories.map((c) => ({
      href: `${listPath}/categorie/${c.slug}`,
      label: c.name,
      active: c.slug === categorySlug,
    })),
  );

  return (
    <main className="mx-auto w-full max-w-(--breakpoint-2xl) flex-1 px-4 py-16 sm:px-6 sm:py-24 md:px-[calc(1.5rem+3.25rem)] lg:px-[calc(2rem+3.25rem)]">
      <p className="flex items-center gap-6 text-sm font-medium uppercase tracking-wide text-black">
        <span aria-hidden="true" className="h-0.5 w-12 bg-amber-300" />
        {blog.label}
      </p>
      <h1 className="mt-6 text-4xl font-semibold text-black sm:text-6xl">
        {current ? current.name : blog.title}
      </h1>

      {categories.length > 0 && (
        <nav aria-label={blog.categories} className="mt-10 flex flex-wrap gap-2">
          {filters.map(({ href, label, active }) => (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="rounded-full border border-black/15 px-4 py-2 text-xs font-medium uppercase tracking-wide text-black transition-colors hover:border-black aria-[current=page]:border-amber-300 aria-[current=page]:bg-amber-300"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      {articles.length > 0 ? (
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-lg text-muted-foreground">{blog.empty}</p>
      )}

      <Pagination current={page} total={totalPages} basePath={basePath} labels={blog.pagination} />
    </main>
  );
}
