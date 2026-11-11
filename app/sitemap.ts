import type { MetadataRoute } from "next";
import { getArticleSlugs } from "@/lib/articles";
import { locales } from "@/lib/i18n";
import { publicPaths, siteUrl } from "@/lib/seo";

const priorities: Record<string, number> = { "": 1, "/actualite": 0.8, "/contact": 0.8 };

// One entry per page and language, each listing its other language versions,
// plus every published article (each in its own language).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = publicPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: path === "" || path === "/actualite" ? ("weekly" as const) : ("yearly" as const),
      priority: priorities[path] ?? 0.3,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
      },
    })),
  );

  const articles = (
    await Promise.all(
      locales.map(async (locale) =>
        (await getArticleSlugs(locale)).map(({ slug, published_at }) => ({
          url: `${siteUrl}/${locale}/actualite/${slug}`,
          lastModified: published_at ?? undefined,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ),
    )
  ).flat();

  return [...pages, ...articles];
}
