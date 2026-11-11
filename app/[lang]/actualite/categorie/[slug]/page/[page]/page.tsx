import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/actualite/article-list";
import { getArticlesPage, getCategories } from "@/lib/articles";
import { format, hasLocale } from "@/lib/i18n";
import { pageParams, parsePageParam } from "@/lib/page-param";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "../../../../../dictionaries";

export async function generateStaticParams({ params }: { params: { lang: string; slug: string } }) {
  if (!hasLocale(params.lang)) return pageParams(0);
  const { totalPages } = await getArticlesPage(params.lang, params.slug, 1);
  return pageParams(totalPages);
}

export async function generateMetadata(
  props: PageProps<"/[lang]/actualite/categorie/[slug]/page/[page]">,
): Promise<Metadata> {
  const { slug, page } = await props.params;
  const locale = await getLocale();
  const { blog } = await getDictionary();
  const category = (await getCategories(locale)).find((c) => c.slug === slug);
  return pageMetadata(locale, `/actualite/categorie/${slug}/page/${page}`, {
    title: format(blog.pageTitle, { title: category?.name ?? blog.metadata.title, n: page }),
    description: blog.metadata.description,
  });
}

async function CategoryArticlesPage(props: PageProps<"/[lang]/actualite/categorie/[slug]/page/[page]">) {
  const { slug, page: pageParam } = await props.params;
  const locale = await getLocale();
  const page = parsePageParam(pageParam);
  const category = (await getCategories(locale)).find((c) => c.slug === slug);
  if (!page || !category) notFound();
  return <ArticleList locale={locale} categorySlug={slug} page={page} />;
}

export default function CategoryPaginatedPage(
  props: PageProps<"/[lang]/actualite/categorie/[slug]/page/[page]">,
) {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <CategoryArticlesPage {...props} />
    </Suspense>
  );
}
