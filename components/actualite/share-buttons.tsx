"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { LinkedInIcon, XIcon } from "@/components/brand-icons";

const buttonClassName =
  "flex size-10 items-center justify-center text-black transition-colors hover:bg-stone-100";

// Shares the current article (address read from the browser on click).
export const ShareButtons = ({
  title,
  labels,
}: {
  title: string;
  labels: Dictionary["blog"]["shareButtons"];
}) => {
  const [copied, setCopied] = useState(false);

  const share = (buildUrl: (url: string, text: string) => string) => {
    const url = encodeURIComponent(window.location.href);
    window.open(buildUrl(url, encodeURIComponent(title)), "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="-ms-2.5 flex items-center gap-1">
      <button
        type="button"
        aria-label={labels.linkedIn}
        className={buttonClassName}
        onClick={() => share((url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`)}
      >
        <LinkedInIcon />
      </button>
      <button
        type="button"
        aria-label={labels.x}
        className={buttonClassName}
        onClick={() => share((url, text) => `https://x.com/intent/post?url=${url}&text=${text}`)}
      >
        <XIcon />
      </button>
      <button
        type="button"
        aria-label={labels.email}
        className={buttonClassName}
        onClick={() => {
          const url = encodeURIComponent(window.location.href);
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${url}`;
        }}
      >
        <Mail className="size-5" />
      </button>
      <button
        type="button"
        aria-label={copied ? labels.copied : labels.copy}
        title={copied ? labels.copied : labels.copy}
        className={buttonClassName}
        onClick={copyLink}
      >
        {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? labels.copiedStatus : ""}
      </span>
    </div>
  );
};
