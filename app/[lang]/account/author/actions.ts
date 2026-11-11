"use server";

import { updateTag } from "next/cache";
import type { WriterErrorKey } from "@/app/[lang]/account/articles/actions";
import { ARTICLES_TAG } from "@/lib/articles";
import { requireWriter } from "@/lib/auth";
import { normalizeEmail, normalizeLinkedIn, normalizeX } from "@/lib/author-links";
import { defaultLocale, hasLocale } from "@/lib/i18n";
import { isOwnStorageUrl, removeOwnImage } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export type AuthorFormState =
  | { error?: WriterErrorKey; saved?: boolean; avatarUrl?: string | null; savedAt?: number }
  | undefined;

export async function saveAuthor(_state: AuthorFormState, formData: FormData): Promise<AuthorFormState> {
  const langField = String(formData.get("lang") ?? "");
  const user = await requireWriter(hasLocale(langField) ? langField : defaultLocale);

  const displayName = String(formData.get("display_name") ?? "").trim();
  const jobTitle = String(formData.get("job_title") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const linkedinUrl = normalizeLinkedIn(String(formData.get("linkedin_url") ?? ""));
  const xUrl = normalizeX(String(formData.get("x_url") ?? ""));
  const contactEmail = normalizeEmail(String(formData.get("contact_email") ?? ""));
  const avatarUrl = String(formData.get("avatar_url") ?? "");

  if (displayName.length < 2 || displayName.length > 100) return { error: "displayName" };
  if (jobTitle.length > 120) return { error: "jobTitle" };
  if (linkedinUrl === undefined) return { error: "linkedin" };
  if (xUrl === undefined) return { error: "x" };
  if (contactEmail === undefined) return { error: "contactEmail" };
  if (avatarUrl && !isOwnStorageUrl(avatarUrl, "avatars", user.id)) return { error: "image" };

  const supabase = await createClient();
  const values = {
    display_name: displayName,
    job_title: jobTitle || null,
    bio: bio || null,
    linkedin_url: linkedinUrl,
    x_url: xUrl,
    contact_email: contactEmail,
    avatar_url: avatarUrl || null,
  };

  // No upsert: the id column can't be updated (table privileges).
  const { data: existing } = await supabase
    .from("authors")
    .select("id, avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("authors").update(values).eq("id", user.id)
    : await supabase.from("authors").insert({ id: user.id, ...values });

  if (error) return { error: "generic" };

  // Old photo replaced or removed: delete it from the bucket.
  if (existing?.avatar_url && existing.avatar_url !== values.avatar_url) {
    await removeOwnImage(supabase, existing.avatar_url, "avatars", user.id);
  }

  // Name and photo are shown on published articles.
  updateTag(ARTICLES_TAG);
  return { saved: true, avatarUrl: values.avatar_url, savedAt: Date.now() };
}
