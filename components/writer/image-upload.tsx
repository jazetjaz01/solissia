"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { format } from "@/lib/i18n";
import type { ImageBucket } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// Same limits as the buckets in Supabase.
const MAX_SIZE: Record<ImageBucket, number> = {
  "article-covers": 5 * 1024 * 1024,
  avatars: 2 * 1024 * 1024,
};
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// Uploads the image to Supabase Storage ({user id}/…) from the browser and
// passes its public URL to the form through a hidden field.
export const ImageUpload = ({
  bucket,
  userId,
  name,
  defaultValue,
  label,
  labels,
  aspect = "aspect-[3/2]",
}: {
  bucket: ImageBucket;
  userId: string;
  name: string;
  defaultValue?: string | null;
  label: string;
  labels: Dictionary["writer"]["image"];
  aspect?: string;
}) => {
  const [url, setUrl] = useState(defaultValue ?? "");
  // Uploaded but not yet saved with the form.
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deletes the intermediate image (replaced or removed before saving).
  // The saved image is deleted on the server after saving.
  const discardPending = async () => {
    if (!pendingPath) return;
    await createClient().storage.from(bucket).remove([pendingPath]);
    setPendingPath(null);
  };

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allows picking the same file again
    if (!file) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError(labels.badType);
      return;
    }
    if (file.size > MAX_SIZE[bucket]) {
      setError(format(labels.tooBig, { max: MAX_SIZE[bucket] / 1024 / 1024 }));
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type });
    setUploading(false);

    if (uploadError) {
      setError(labels.failed);
      return;
    }
    await discardPending();
    setPendingPath(path);
    setUrl(supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl);
  };

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium uppercase tracking-wide text-black">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className={cn("relative w-full overflow-hidden border border-dashed border-black/20 bg-stone-100", aspect)}>
        {url ? (
          <Image src={url} alt="" fill sizes="600px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            {labels.none}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <label className="cursor-pointer text-sm text-black underline underline-offset-4 has-focus-visible:ring-2 has-focus-visible:ring-amber-300">
          {uploading ? labels.uploading : url ? labels.change : labels.choose}
          <input
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={onChange}
            disabled={uploading}
            className="sr-only"
          />
        </label>
        {url && !uploading && (
          <button
            type="button"
            onClick={async () => {
              await discardPending();
              setUrl("");
            }}
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            {labels.remove}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
