import Link from "next/link";
import { getLatestArticles } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { CoverImage } from "@/components/actualite/cover-image";
import { SectionTitle } from "@/components/actualite/section-title";

// Sidebar: the 3 latest articles (thumbnail, title, date).
export async function LatestArticles({
  locale,
  excludeSlug,
  title,
}: {
  locale: Locale;
  excludeSlug: string;
  title: string;
}) {
  const articles = await getLatestArticles(locale, excludeSlug);
  if (articles.length === 0) return null;

  return (
    <aside aria-labelledby="latest-articles-title" className="lg:sticky lg:top-24">
      <SectionTitle id="latest-articles-title">{title}</SectionTitle>
      <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/${locale}/actualite/${article.slug}`} className="group flex gap-4 py-5">
              <CoverImage
                src={article.cover_image_url}
                sizes="96px"
                logoSize={28}
                className="aspect-[4/3] w-24 shrink-0"
              />
              <div className="min-w-0">
                <p className="line-clamp-3 text-sm font-medium leading-snug text-black group-hover:underline group-hover:decoration-amber-300 group-hover:decoration-2 group-hover:underline-offset-4">
                  {article.title}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(article.published_at, locale)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
