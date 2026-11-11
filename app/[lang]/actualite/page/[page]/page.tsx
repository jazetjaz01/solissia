import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/actualite/article-list";
import { getArticlesPage } from "@/lib/articles";
import { format, hasLocale } from "@/lib/i18n";
import { pageParams, parsePageParam } from "@/lib/page-param";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "../../../dictionaries";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!hasLocale(params.lang)) return pageParams(0);
  const { totalPages } = await getArticlesPage(params.lang, undefined, 1);
  return pageParams(totalPages);
}

export async function generateMetadata(
  props: PageProps<"/[lang]/actualite/page/[page]">,
): Promise<Metadata> {
  const { page } = await props.params;
  const locale = await getLocale();
  const { blog } = await getDictionary();
  return pageMetadata(locale, `/actualite/page/${page}`, {
    title: format(blog.pageTitle, { title: blog.metadata.title, n: page }),
    description: blog.metadata.description,
  });
}

async function ArticlesPage(props: PageProps<"/[lang]/actualite/page/[page]">) {
  const page = parsePageParam((await props.params).page);
  if (!page) notFound();
  return <ArticleList locale={await getLocale()} page={page} />;
}

export default function ActualitePaginatedPage(props: PageProps<"/[lang]/actualite/page/[page]">) {
  // params is read inside Suspense (pages created after the build).
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <ArticlesPage {...props} />
    </Suspense>
  );
}
