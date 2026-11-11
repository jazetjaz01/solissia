import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

// A block of a legal page: optional heading, paragraphs, a bullet list,
// then paragraphs after the list.
export type LegalBlock = {
  heading?: string;
  lines?: string[];
  items?: string[];
  after?: string[];
};
export type LegalSection = { title: string; warning?: string; blocks: LegalBlock[] };

const linkClass = "underline underline-offset-4 decoration-black/30 hover:decoration-black";

// Turns [label](/path) into a site link (prefixed with the locale), and
// emails, web addresses and phone numbers into links.
const pattern =
  /(\[[^\]]+\]\(\/[^)]*\)|\S+@\S+\.\w+|https?:\/\/\S+|www\.\S+\.\w+(?=[\s).,]|$)|(?:\+33 |0)\d(?: \d\d){4})/;

const Line = ({ text, locale }: { text: string; locale: string }) =>
  text.split(pattern).map((part, i): ReactNode => {
    if (i % 2 === 0) return part;

    const internal = part.match(/^\[([^\]]+)\]\((\/[^)]*)\)$/);
    if (internal) {
      return (
        <Link key={i} href={`/${locale}${internal[2]}`} className={linkClass}>
          {internal[1]}
        </Link>
      );
    }

    // Our own domain is the site itself, not a link out.
    if (part.startsWith("www.solissia.com")) return part;

    const href = part.includes("@")
      ? `mailto:${part}`
      : part.startsWith("http")
        ? part
        : part.startsWith("www.")
          ? `https://${part}`
          : `tel:+33${part.replace(/\D/g, "").replace(/^(33|0)/, "")}`;
    const external = href.startsWith("http");
    return (
      <a
        key={i}
        href={href}
        className={linkClass}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {part}
      </a>
    );
  });

const Paragraphs = ({ lines, locale }: { lines: string[]; locale: string }) => (
  <div className="space-y-3">
    {lines.map((line) => (
      <p key={line}>
        <Line text={line} locale={locale} />
      </p>
    ))}
  </div>
);

export const LegalDocument = ({
  locale,
  homeLabel,
  title,
  updated,
  sections,
}: {
  locale: string;
  homeLabel: string;
  title: string;
  updated?: string;
  sections: LegalSection[];
}) => (
  <main className="mx-auto w-full max-w-(--breakpoint-2xl) flex-1 px-4 py-16 sm:px-6 sm:py-24 md:px-[calc(1.5rem+3.25rem)] lg:px-[calc(2rem+3.25rem)]">
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link href={`/${locale}`} className="hover:text-black">
            {homeLabel}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="text-black">
          {title}
        </li>
      </ol>
    </nav>

    <h1 className="mt-8 text-4xl font-semibold text-black sm:text-6xl">{title}</h1>
    <div className="mt-5 h-1 w-16 rounded-full bg-amber-300" />
    {updated && <p className="mt-6 text-muted-foreground">{updated}</p>}

    <div className="mt-14 max-w-4xl space-y-16">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-2xl font-semibold text-black sm:text-3xl">{section.title}</h2>
          {section.warning && (
            <p className="mt-6 border-l-4 border-amber-300 bg-amber-50 px-5 py-4 text-sm font-medium uppercase tracking-wide text-black">
              {section.warning}
            </p>
          )}
          <div className="mt-8 space-y-10">
            {section.blocks.map((block, i) => (
              <div key={block.heading ?? i}>
                {block.heading && (
                  <h3 className="mb-5 flex items-center gap-6 border-b border-black/10 pb-4 text-sm font-medium uppercase tracking-wide text-black">
                    <span aria-hidden="true" className="h-0.5 w-12 bg-amber-300" />
                    {block.heading}
                  </h3>
                )}
                <div className="space-y-4 text-lg leading-relaxed text-black/80">
                  {block.lines && <Paragraphs lines={block.lines} locale={locale} />}
                  {block.items && (
                    <ul className="space-y-2">
                      {block.items.map((item) => (
                        <li key={item} className="flex gap-4">
                          <span aria-hidden="true" className="mt-3.5 h-0.5 w-3 shrink-0 bg-amber-300" />
                          <span>
                            <Line text={item} locale={locale} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {block.after && <Paragraphs lines={block.after} locale={locale} />}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </main>
);
