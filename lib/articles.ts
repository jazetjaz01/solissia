import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/lib/i18n";
import { supabaseKey, supabaseUrl } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

// Cache tag to invalidate when an article is created, edited or deleted.
export const ARTICLES_TAG = "articles";

// Number of articles per page of the list.
export const ARTICLES_PER_PAGE = 9;

const ARTICLE_FIELDS = `
  id, locale, slug, title, excerpt, content, cover_image_url, published_at,
  category:categories (id, slug, name_fr, name_en),
  author:authors (id, display_name, job_title, avatar_url, linkedin_url, x_url, contact_email)
`;

type CategoryRow = { id: number; slug: string; name_fr: string; name_en: string };

export type Category = { id: number; slug: string; name: string };
export type Author = {
  id: string;
  display_name: string;
  job_title: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  x_url: string | null;
  contact_email: string | null;
};
export type Article = {
  id: string;
  locale: Locale;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  category: Category | null;
  author: Author | null;
};
type ArticleRow = Omit<Article, "category"> & { category: CategoryRow | null };

export type ArticleSummary = Pick<Article, "id" | "slug" | "title" | "cover_image_url" | "published_at">;
export type ArticlesPage = { articles: Article[]; totalPages: number };

// Articles are edited directly in Supabase for now: keep the cache short so a
// new article shows up within a minute.
const cacheArticles = () => {
  cacheTag(ARTICLES_TAG);
  cacheLife("minutes");
};

const toCategory = (row: CategoryRow, locale: Locale): Category => ({
  id: row.id,
  slug: row.slug,
  name: locale === "fr" ? row.name_fr : row.name_en,
});

const toArticle = (row: ArticleRow, locale: Locale): Article => ({
  ...row,
  category: row.category && toCategory(row.category, locale),
});

// Without Supabase keys (e.g. a build without env vars), act as if there were no articles.
const configured = () => Boolean(supabaseUrl && supabaseKey);

export async function getCategories(locale: Locale): Promise<Category[]> {
  "use cache";
  cacheArticles();
  if (!configured()) return [];

  const { data, error } = await createPublicClient()
    .from("categories")
    .select("id, slug, name_fr, name_en")
    .overrideTypes<CategoryRow[], { merge: false }>();
  if (error) throw error;
  return data
    .map((row) => toCategory(row, locale))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}

// One page of published articles in a language (page 1 = most recent), optionally by category.
export async function getArticlesPage(
  locale: Locale,
  categorySlug: string | undefined,
  page: number,
): Promise<ArticlesPage> {
  "use cache";
  cacheArticles();
  if (!configured()) return { articles: [], totalPages: 0 };

  const from = (page - 1) * ARTICLES_PER_PAGE;
  let query = createPublicClient()
    .from("articles")
    .select(ARTICLE_FIELDS, { count: "exact" })
    .eq("locale", locale)
    .order("published_at", { ascending: false })
    .range(from, from + ARTICLES_PER_PAGE - 1);

  if (categorySlug) {
    const category = (await getCategories(locale)).find((c) => c.slug === categorySlug);
    if (!category) return { articles: [], totalPages: 0 };
    query = query.eq("category_id", category.id);
  }

  // RLS only returns published articles to visitors.
  const { data, error, count } = await query.overrideTypes<ArticleRow[], { merge: false }>();
  if (error) {
    // Page past the last one: PostgREST answers with a 416 error.
    if (error.code === "PGRST103") return { articles: [], totalPages: 0 };
    throw error;
  }
  return {
    articles: data.map((row) => toArticle(row, locale)),
    totalPages: Math.ceil((count ?? 0) / ARTICLES_PER_PAGE),
  };
}

// Slugs of all published articles in a language (prerendering, sitemap).
export async function getArticleSlugs(locale: Locale): Promise<{ slug: string; published_at: string | null }[]> {
  "use cache";
  cacheArticles();
  if (!configured()) return [];

  const { data, error } = await createPublicClient()
    .from("articles")
    .select("slug, published_at")
    .eq("locale", locale)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Latest published articles except the current one (sidebar).
export async function getLatestArticles(
  locale: Locale,
  excludeSlug: string,
  limit = 3,
): Promise<ArticleSummary[]> {
  "use cache";
  cacheArticles();
  if (!configured()) return [];

  const { data, error } = await createPublicClient()
    .from("articles")
    .select("id, slug, title, cover_image_url, published_at")
    .eq("locale", locale)
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getPublishedArticle(locale: Locale, slug: string): Promise<Article | null> {
  "use cache";
  cacheArticles();
  if (!configured()) return null;

  const { data, error } = await createPublicClient()
    .from("articles")
    .select(ARTICLE_FIELDS)
    .eq("locale", locale)
    .eq("slug", slug)
    .overrideTypes<ArticleRow[], { merge: false }>();
  if (error) throw error;
  return data[0] ? toArticle(data[0], locale) : null;
}
