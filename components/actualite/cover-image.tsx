import Image from "next/image";
import { cn } from "@/lib/utils";

// Article cover, or a faded Solissia logo when the article has none.
export const CoverImage = ({
  src,
  sizes,
  logoSize,
  priority,
  className,
}: {
  src: string | null;
  sizes: string;
  logoSize: number;
  priority?: boolean;
  className?: string;
}) => (
  <div className={cn("relative overflow-hidden bg-stone-100", className)}>
    {src ? (
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    ) : (
      <Image
        src="/solissia-logo-200.svg"
        alt=""
        width={logoSize}
        height={logoSize}
        className="absolute inset-0 m-auto opacity-20"
        style={{ width: logoSize, height: logoSize }}
      />
    )}
  </div>
);
