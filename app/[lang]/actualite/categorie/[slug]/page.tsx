import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/actualite/article-list";
import { getCategories } from "@/lib/articles";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "../../../dictionaries";

// cacheComponents requires at least one param at build time.
const PLACEHOLDER = "__aucune-categorie__";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const categories = hasLocale(params.lang) ? await getCategories(params.lang) : [];
  return categories.length > 0 ? categories.map((c) => ({ slug: c.slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata(
  props: PageProps<"/[lang]/actualite/categorie/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const locale = await getLocale();
  const { blog } = await getDictionary();
  const category = (await getCategories(locale)).find((c) => c.slug === slug);
  return pageMetadata(locale, `/actualite/categorie/${slug}`, {
    title: category ? `${category.name} – ${blog.metadata.title}` : blog.metadata.title,
    description: blog.metadata.description,
  });
}

async function CategoryArticles(props: PageProps<"/[lang]/actualite/categorie/[slug]">) {
  const { slug } = await props.params;
  const locale = await getLocale();
  const category = (await getCategories(locale)).find((c) => c.slug === slug);
  if (!category) notFound();
  return <ArticleList locale={locale} categorySlug={slug} />;
}

export default function CategoryPage(props: PageProps<"/[lang]/actualite/categorie/[slug]">) {
  // params is read inside Suspense (categories added after the build).
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <CategoryArticles {...props} />
    </Suspense>
  );
}
