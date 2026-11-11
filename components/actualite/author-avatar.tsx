import Image from "next/image";
import type { Author } from "@/lib/articles";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

// Author photo, or their initials when there is none.
export const AuthorAvatar = ({
  author,
  size,
  className,
}: {
  author: Author;
  size: number;
  className?: string;
}) =>
  author.avatar_url ? (
    <Image
      src={author.avatar_url}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 object-cover", className)}
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center bg-black font-medium text-white", className)}
      style={{ width: size, height: size, fontSize: size / 3 }}
    >
      {initials(author.display_name)}
    </span>
  );
