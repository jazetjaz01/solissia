import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { format } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Pages shown: first two, last two, current and its neighbours; "…" replaces
// hidden pages. E.g. page 1 of 10: 1 2 … 9 10
export function pageItems(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const items: (number | "…")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) items.push("…");
    items.push(page);
  });
  return items;
}

const cell = "flex size-12 items-center justify-center text-base font-semibold sm:size-14";

export const Pagination = ({
  current,
  total,
  basePath,
  labels,
}: {
  current: number;
  total: number;
  // Page 1 = basePath, page n = basePath/page/n
  basePath: string;
  labels: Dictionary["blog"]["pagination"];
}) => {
  if (total <= 1) return null;
  const href = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`);

  const arrow = (page: number, label: string, icon: ReactNode) =>
    page >= 1 && page <= total ? (
      <Link href={href(page)} aria-label={label} className={cn(cell, "hover:bg-stone-100")}>
        {icon}
      </Link>
    ) : (
      <span aria-hidden="true" className={cn(cell, "text-black/20")}>
        {icon}
      </span>
    );

  return (
    <nav aria-label={labels.label} className="mt-16 flex items-center justify-center text-black">
      {arrow(current - 1, labels.previous, <ArrowLeft className="size-5" />)}

      {pageItems(current, total).map((item, i) =>
        item === "…" ? (
          <span key={`ellipsis-${i}`} aria-hidden="true" className={cell}>
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-label={format(labels.page, { n: item })}
            aria-current={item === current ? "page" : undefined}
            className={cn(
              cell,
              "transition-colors hover:bg-stone-100 aria-[current=page]:bg-amber-300 aria-[current=page]:hover:bg-amber-300",
            )}
          >
            {item}
          </Link>
        ),
      )}

      {arrow(current + 1, labels.next, <ArrowRight className="size-5" />)}
    </nav>
  );
};
