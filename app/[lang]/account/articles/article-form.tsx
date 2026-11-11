"use client";

import { useActionState, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Field, inputClass } from "@/components/writer/fields";
import { ImageUpload } from "@/components/writer/image-upload";
import type { Category } from "@/lib/articles";
import { slugify } from "@/lib/format";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { saveArticle } from "./actions";

export type ArticleValues = {
  id: string;
  locale: Locale;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category_id: number | null;
  cover_image_url: string | null;
  status: "draft" | "published";
};

const languageNames: Record<Locale, string> = { fr: "Français", en: "English" };

export const ArticleForm = ({
  lang,
  userId,
  categories,
  article,
  t,
}: {
  lang: Locale;
  userId: string;
  categories: Category[];
  article?: ArticleValues;
  t: Dictionary["writer"];
}) => {
  const [state, action, pending] = useActionState(saveArticle, undefined);
  const [articleLocale, setArticleLocale] = useState<Locale>(article?.locale ?? lang);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  // The address follows the title until it is edited by hand.
  const [slugEdited, setSlugEdited] = useState(Boolean(article));
  const published = article?.status === "published";

  return (
    <form action={action} className="mt-10 grid gap-8">
      <input type="hidden" name="lang" value={lang} />
      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="locale" label={t.form.language}>
          <select
            id="locale"
            name="locale"
            value={articleLocale}
            onChange={(e) => setArticleLocale(e.target.value as Locale)}
            className={cn(inputClass, "h-12")}
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {languageNames[l]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="category_id" label={t.form.category}>
          <select
            id="category_id"
            name="category_id"
            defaultValue={article?.category_id ?? ""}
            className={cn(inputClass, "h-12")}
          >
            <option value="">{t.form.noCategory}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="title" label={t.form.title}>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
          minLength={3}
          maxLength={200}
          required
          className={cn(inputClass, "h-12")}
        />
      </Field>

      <Field id="slug" label={t.form.slug}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="shrink-0">/{articleLocale}/actualite/</span>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            onBlur={() => setSlug(slugify(slug))}
            required
            className={cn(inputClass, "h-12")}
          />
        </div>
      </Field>

      <ImageUpload
        bucket="article-covers"
        userId={userId}
        name="cover_image_url"
        defaultValue={article?.cover_image_url}
        label={t.form.cover}
        labels={t.image}
      />

      <Field id="excerpt" label={t.form.excerpt} optional={t.form.optional} hint={t.form.excerptHint}>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={article?.excerpt ?? ""}
          className={cn(inputClass, "resize-y py-3")}
        />
      </Field>

      <Field id="content" label={t.form.content} hint={t.form.contentHint}>
        <textarea
          id="content"
          name="content"
          rows={16}
          defaultValue={article?.content ?? ""}
          className={cn(inputClass, "resize-y py-3")}
        />
      </Field>

      {state?.error && (
        <p role="alert" className="bg-destructive/10 p-4 text-destructive">
          {t.errors[state.error]}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="status"
          value="published"
          disabled={pending}
          className="h-12 bg-black px-8 text-sm font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-black/85 focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-50"
        >
          {pending ? t.form.saving : published ? t.form.update : t.form.publish}
        </button>
        <button
          type="submit"
          name="status"
          value="draft"
          disabled={pending}
          className="h-12 border-2 border-black px-8 text-sm font-medium uppercase tracking-[0.15em] text-black transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-50"
        >
          {published ? t.form.unpublish : t.form.saveDraft}
        </button>
      </div>
    </form>
  );
};
