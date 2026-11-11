import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleAuthorAside } from "@/components/actualite/article-author-aside";
import { CoverImage } from "@/components/actualite/cover-image";
import { LatestArticles } from "@/components/actualite/latest-articles";
import { getArticleSlugs, getPublishedArticle, type Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { format, hasLocale } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";
import { getDictionary, getLocale } from "../../dictionaries";

// cacheComponents requires at least one param at build time:
// as long as no article is published, a placeholder page (404) is prerendered.
const PLACEHOLDER = "__aucun-article__";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const articles = hasLocale(params.lang) ? await getArticleSlugs(params.lang) : [];
  return articles.length > 0 ? articles.map((a) => ({ slug: a.slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata(
  props: PageProps<"/[lang]/actualite/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const locale = await getLocale();
  const { blog } = await getDictionary();
  const article = await getPublishedArticle(locale, slug);
  if (!article) return { title: blog.notFound, robots: { index: false } };

  const description = article.excerpt ?? undefined;
  const path = `/${locale}/actualite/${article.slug}`;
  return {
    title: article.title,
    description,
    // Each article exists in one language only: no hreflang.
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      siteName: "Solissia",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: path,
      title: article.title,
      description,
      publishedTime: article.published_at ?? undefined,
      authors: article.author ? [article.author.display_name] : undefined,
      images: article.cover_image_url ? [article.cover_image_url] : undefined,
    },
    twitter: { card: "summary_large_image", title: article.title, description },
  };
}

// Structured data so Google understands the page is a blog article.
const articleJsonLd = (article: Article, locale: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: article.title,
  description: article.excerpt ?? undefined,
  image: article.cover_image_url ?? undefined,
  datePublished: article.published_at ?? undefined,
  inLanguage: locale,
  mainEntityOfPage: `${siteUrl}/${locale}/actualite/${article.slug}`,
  author: article.author
    ? { "@type": "Person", name: article.author.display_name, jobTitle: article.author.job_title ?? undefined }
    : { "@id": `${siteUrl}/#organization` },
  publisher: { "@id": `${siteUrl}/#organization` },
  articleSection: article.category?.name,
});

async function ArticleContent(props: PageProps<"/[lang]/actualite/[slug]">) {
  const { slug } = await props.params;
  const locale = await getLocale();
  const { blog } = await getDictionary();
  const article = await getPublishedArticle(locale, slug);
  if (!article) notFound();

  // Paragraphs are separated by a blank line.
  const paragraphs = article.content.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    // ≥ 1280 px: author | article | latest articles
    // 1024–1280 px: article (author below) | latest articles; mobile: stacked
    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[13rem_minmax(0,1fr)_17rem] xl:gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(article, locale)).replace(/</g, "\\u003c"),
        }}
      />
      <article className="lg:col-start-1 lg:row-start-1 xl:col-start-2">
        <Link
          href={`/${locale}/actualite`}
          className="inline-flex items-center gap-2 text-sm text-black hover:underline hover:underline-offset-4"
        >
          <ArrowLeft className="size-4" />
          {blog.back}
        </Link>

        {article.category && (
          <Link
            href={`/${locale}/actualite/categorie/${article.category.slug}`}
            className="mt-10 block text-xs font-medium uppercase tracking-wide text-black/50 hover:text-black"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-5 h-1 w-16 rounded-full bg-amber-300" />
        {article.excerpt && <p className="mt-6 text-xl text-black/80">{article.excerpt}</p>}
        <p className="mt-8 text-sm text-muted-foreground">
          {format(blog.publishedOn, { date: formatDate(article.published_at, locale) })}
        </p>

        {article.cover_image_url && (
          <CoverImage
            src={article.cover_image_url}
            sizes="(min-width: 1024px) 680px, 100vw"
            logoSize={64}
            priority
            className="mt-10 aspect-[16/9]"
          />
        )}

        {/* Justified with hyphenation (page lang) to avoid wide gaps between words. */}
        <div className="mt-10 space-y-6 text-justify text-lg leading-relaxed text-black/80 hyphens-auto">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      <div className="lg:col-start-1 lg:row-start-2 xl:row-start-1">
        <ArticleAuthorAside author={article.author} title={article.title} blog={blog} />
      </div>
      <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 xl:col-start-3 xl:row-span-1">
        <LatestArticles locale={locale} excludeSlug={article.slug} title={blog.latest} />
      </div>
    </div>
  );
}

export default async function ArticlePage(props: PageProps<"/[lang]/actualite/[slug]">) {
  const { blog } = await getDictionary();
  return (
    <main className="mx-auto w-full max-w-(--breakpoint-2xl) flex-1 px-4 py-16 sm:px-6 lg:px-8">
      {/* params is read inside Suspense (articles published after the build). */}
      <Suspense fallback={<p className="text-muted-foreground">{blog.loading}</p>}>
        <ArticleContent {...props} />
      </Suspense>
    </main>
  );
}
