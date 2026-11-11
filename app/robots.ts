import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Everything can be crawled: account and login pages carry a "noindex" tag,
// which Google can only read if it is allowed to crawl them.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
