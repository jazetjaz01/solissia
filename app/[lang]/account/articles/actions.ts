"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { ARTICLES_TAG } from "@/lib/articles";
import { requireWriter } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { defaultLocale, hasLocale, type Locale } from "@/lib/i18n";
import { isOwnStorageUrl, removeOwnImage } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export type WriterErrorKey = keyof Dictionary["writer"]["errors"];
export type ArticleFormState = { error?: WriterErrorKey } | undefined;

// Server Actions can't read root params: the forms send the site language.
const siteLang = (formData: FormData): Locale => {
  const lang = String(formData.get("lang") ?? "");
  return hasLocale(lang) ? lang : defaultLocale;
};

export async function saveArticle(
  _state: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const lang = siteLang(formData);
  const user = await requireWriter(lang);

  const id = String(formData.get("id") ?? "");
  const articleLocale = String(formData.get("locale") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categoryId = Number(formData.get("category_id")) || null;
  const coverImageUrl = String(formData.get("cover_image_url") ?? "");
  const status = formData.get("status") === "published" ? "published" : "draft";

  if (title.length < 3 || title.length > 200) return { error: "title" };
  if (!slug) return { error: "slug" };
  if (status === "published" && !content) return { error: "content" };
  if (coverImageUrl && !isOwnStorageUrl(coverImageUrl, "article-covers", user.id)) {
    return { error: "image" };
  }

  const supabase = await createClient();

  const { data: author } = await supabase.from("authors").select("id").eq("id", user.id).maybeSingle();
  if (!author) return { error: "needAuthor" };

  const values = {
    locale: hasLocale(articleLocale) ? articleLocale : lang,
    title,
    slug,
    excerpt: excerpt || null,
    content,
    category_id: categoryId,
    cover_image_url: coverImageUrl || null,
    status,
  };

  // Current image, deleted from the bucket if it is replaced or removed.
  const previousCover = id
    ? (
        await supabase
          .from("articles")
          .select("cover_image_url")
          .eq("id", id)
          .eq("author_id", user.id)
          .maybeSingle()
      ).data?.cover_image_url
    : null;

  // RLS limits writing to the signed-in author's own articles.
  const { error } = id
    ? await supabase.from("articles").update(values).eq("id", id).eq("author_id", user.id)
    : await supabase.from("articles").insert({ ...values, author_id: user.id });

  if (error) return { error: error.code === "23505" ? "slugTaken" : "generic" };

  if (previousCover && previousCover !== values.cover_image_url) {
    await removeOwnImage(supabase, previousCover, "article-covers", user.id);
  }

  updateTag(ARTICLES_TAG);
  redirect(`/${lang}/account/articles`);
}

export async function deleteArticle(langParam: string, id: string) {
  // Checked again: it ends up in redirect URLs.
  const lang = hasLocale(langParam) ? langParam : defaultLocale;
  const user = await requireWriter(lang);
  const supabase = await createClient();

  const { data: deleted } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id)
    .select("cover_image_url")
    .maybeSingle();
  // The image is removed from the bucket only if the article really was deleted.
  await removeOwnImage(supabase, deleted?.cover_image_url, "article-covers", user.id);

  updateTag(ARTICLES_TAG);
  redirect(`/${lang}/account/articles`);
}
