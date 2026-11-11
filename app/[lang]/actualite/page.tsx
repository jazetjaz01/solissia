import type { Metadata } from "next";
import { ArticleList } from "@/components/actualite/article-list";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { blog } = await getDictionary();
  return pageMetadata(locale, "/actualite", blog.metadata);
}

export default async function ActualitePage() {
  return <ArticleList locale={await getLocale()} />;
}
