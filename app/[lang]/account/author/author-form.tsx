"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Field, inputClass } from "@/components/writer/fields";
import { ImageUpload } from "@/components/writer/image-upload";
import { cn } from "@/lib/utils";
import { saveAuthor } from "./actions";

type AuthorValues = {
  display_name: string;
  job_title: string | null;
  bio: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  x_url: string | null;
  contact_email: string | null;
};

export const AuthorForm = ({
  lang,
  userId,
  author,
  t,
}: {
  lang: string;
  userId: string;
  author: AuthorValues | null;
  t: Dictionary["writer"];
}) => {
  const [state, action, pending] = useActionState(saveAuthor, undefined);
  const a = t.author;

  return (
    <form action={action} className="mt-10 grid gap-8">
      <input type="hidden" name="lang" value={lang} />
      <div className="max-w-40">
        {/* Remounted after each save: the saved photo becomes the reference. */}
        <ImageUpload
          key={state?.savedAt}
          bucket="avatars"
          userId={userId}
          name="avatar_url"
          defaultValue={state?.savedAt ? state.avatarUrl : author?.avatar_url}
          label={a.photo}
          labels={t.image}
          aspect="aspect-square"
        />
      </div>
      <Field id="display_name" label={a.displayName}>
        <input
          id="display_name"
          name="display_name"
          defaultValue={author?.display_name}
          minLength={2}
          maxLength={100}
          required
          autoComplete="name"
          className={cn(inputClass, "h-12")}
        />
      </Field>
      <Field id="job_title" label={a.jobTitle} optional={t.form.optional}>
        <input
          id="job_title"
          name="job_title"
          defaultValue={author?.job_title ?? ""}
          maxLength={120}
          placeholder={a.jobTitlePlaceholder}
          className={cn(inputClass, "h-12")}
        />
      </Field>
      <Field id="bio" label={a.bio} optional={t.form.optional}>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={author?.bio ?? ""}
          className={cn(inputClass, "resize-y py-3")}
        />
      </Field>

      <fieldset className="grid gap-8 border-t border-black/10 pt-8">
        <legend className="-mt-3 bg-background pe-3 text-sm font-medium uppercase tracking-wide text-black">
          {a.links} <span className="font-normal normal-case tracking-normal text-black/50">({t.form.optional})</span>
        </legend>
        <p className="-mt-4 text-sm text-muted-foreground">{a.linksHint}</p>
        <Field id="linkedin_url" label={a.linkedin}>
          <input
            id="linkedin_url"
            name="linkedin_url"
            defaultValue={author?.linkedin_url ?? ""}
            placeholder="https://www.linkedin.com/in/…"
            inputMode="url"
            className={cn(inputClass, "h-12")}
          />
        </Field>
        <Field id="x_url" label={a.x}>
          <input
            id="x_url"
            name="x_url"
            defaultValue={author?.x_url ?? ""}
            placeholder="@…"
            className={cn(inputClass, "h-12")}
          />
        </Field>
        <Field id="contact_email" label={a.contactEmail}>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={author?.contact_email ?? ""}
            placeholder="…@solissia.com"
            className={cn(inputClass, "h-12")}
          />
        </Field>
      </fieldset>

      {state?.error && (
        <p role="alert" className="bg-destructive/10 p-4 text-destructive">
          {t.errors[state.error]}
        </p>
      )}
      {state?.saved && (
        <p role="status" className="bg-emerald-50 p-4 text-emerald-900">
          {a.saved}{" "}
          <Link href={`/${lang}/account/articles/new`} className="font-medium underline underline-offset-4">
            {t.newArticle}
          </Link>
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="h-12 bg-black px-8 text-sm font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-black/85 focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-50"
        >
          {pending ? t.form.saving : a.save}
        </button>
      </div>
    </form>
  );
};
