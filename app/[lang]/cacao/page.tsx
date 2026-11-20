import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { cacao } = await getDictionary();
  return pageMetadata(locale, "/cacao", cacao.metadata);
}

export default async function CacaoPage() {
  const { cacao: t } = await getDictionary();

  return (
    <main className="flex-1">
      {/* Same banner as the home page, under the transparent navbar.
          Cocoa-brown background until a cacao photo is added. */}
      <section className="relative -mt-16 h-[calc(60vh+4rem)] bg-[#3b2416]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto flex h-full max-w-(--breakpoint-2xl) flex-col items-center justify-center px-4 pt-16 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-semibold leading-tight text-white sm:text-7xl">
            {t.title}
          </h1>
          <div className="mt-6 h-1 w-16 rounded-full bg-amber-300" />
        </div>
      </section>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6 text-center text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {t.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
