import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDictionary, getLocale } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { legal } = await getDictionary();
  return legal.metadata;
}

// Not every block has a heading.
type Block = { heading?: string; lines: string[] };

const linkClass = "underline underline-offset-4 decoration-black/30 hover:decoration-black";

// Turns emails, web addresses and phone numbers in a line into links.
const Line = ({ text }: { text: string }) => {
  const parts = text.split(/(\S+@\S+\.\w+|https?:\/\/\S+|(?:\+33 |0)\d(?: \d\d){4})/);
  return parts.map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@")
      ? `mailto:${part}`
      : part.startsWith("http")
        ? part
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
};

export default async function LegalPage() {
  const locale = await getLocale();
  const { legal } = await getDictionary();

  return (
    <main className="mx-auto w-full max-w-(--breakpoint-2xl) flex-1 px-4 py-16 sm:px-6 sm:py-24 md:px-[calc(1.5rem+3.25rem)] lg:px-[calc(2rem+3.25rem)]">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href={`/${locale}`} className="hover:text-black">
              {legal.breadcrumbHome}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="text-black">
            {legal.title}
          </li>
        </ol>
      </nav>

      <h1 className="mt-8 text-4xl font-semibold text-black sm:text-6xl">{legal.title}</h1>
      <div className="mt-5 h-1 w-16 rounded-full bg-amber-300" />

      <div className="mt-14 max-w-4xl space-y-16">
        {legal.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-2xl font-semibold text-black sm:text-3xl">{section.title}</h2>
            {section.warning && (
              <p className="mt-6 border-l-4 border-amber-300 bg-amber-50 px-5 py-4 text-sm font-medium uppercase tracking-wide text-black">
                {section.warning}
              </p>
            )}
            <div className="mt-8 space-y-10">
              {(section.blocks as Block[]).map((block, i) => (
                <div key={block.heading ?? i}>
                  {block.heading && (
                    <h3 className="flex items-center gap-6 border-b border-black/10 pb-4 text-sm font-medium uppercase tracking-wide text-black">
                      <span aria-hidden="true" className="h-0.5 w-12 bg-amber-300" />
                      {block.heading}
                    </h3>
                  )}
                  <div className="mt-5 space-y-1 text-lg leading-relaxed text-black/80">
                    {block.lines.map((line) => (
                      <p key={line}>
                        <Line text={line} />
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
