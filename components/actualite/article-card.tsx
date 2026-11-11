import Link from "next/link";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { AuthorAvatar } from "@/components/actualite/author-avatar";
import { CoverImage } from "@/components/actualite/cover-image";

export const ArticleCard = ({ article, locale }: { article: Article; locale: Locale }) => (
  <article className="group flex flex-col">
    <Link href={`/${locale}/actualite/${article.slug}`} className="flex flex-1 flex-col">
      <CoverImage
        src={article.cover_image_url}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        logoSize={64}
        className="aspect-[3/2]"
      />
      {article.category && (
        <p className="mt-5 text-xs font-medium uppercase tracking-wide text-black/50">
          {article.category.name}
        </p>
      )}
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-black group-hover:underline group-hover:decoration-amber-300 group-hover:decoration-2 group-hover:underline-offset-4">
        {article.title}
      </h2>
      {article.excerpt && <p className="mt-3 line-clamp-3 text-muted-foreground">{article.excerpt}</p>}
    </Link>
    <div className="mt-5 flex items-center gap-3 text-sm leading-tight">
      {article.author && <AuthorAvatar author={article.author} size={36} className="rounded-full" />}
      <div>
        {article.author && <p className="font-medium text-black">{article.author.display_name}</p>}
        <p className="text-muted-foreground">{formatDate(article.published_at, locale)}</p>
      </div>
    </div>
  </article>
);
