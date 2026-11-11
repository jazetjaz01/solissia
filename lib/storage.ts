import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/supabase/env";

export type ImageBucket = "article-covers" | "avatars";

const publicPrefix = (bucket: ImageBucket) =>
  `${supabaseUrl}/storage/v1/object/public/${bucket}/`;

// Only accepts images the user uploaded to their own folder of the bucket
// (prevents saving an arbitrary external URL).
export const isOwnStorageUrl = (url: string, bucket: ImageBucket, userId: string) =>
  url.startsWith(`${publicPrefix(bucket)}${userId}/`);

// Public URL → path in the bucket ("{userId}/{file}").
export const storagePathFromUrl = (url: string, bucket: ImageBucket) =>
  decodeURIComponent(url.slice(publicPrefix(bucket).length));

// Deletes an image from the bucket if it belongs to the user.
// A failure doesn't block saving: at worst an orphan file remains.
export async function removeOwnImage(
  supabase: SupabaseClient,
  url: string | null | undefined,
  bucket: ImageBucket,
  userId: string,
) {
  if (!url || !isOwnStorageUrl(url, bucket, userId)) return;
  await supabase.storage.from(bucket).remove([storagePathFromUrl(url, bucket)]);
}
