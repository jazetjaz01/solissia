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
    <main className="mx-auto w-full max-w-(--breakpoint-2xl) flex-1 px-4 py-16 sm:px-6 sm:py-24 md:px-[calc(1.5rem+3.25rem)] lg:px-[calc(2rem+3.25rem)]">
      <h1 className="text-4xl font-semibold text-black sm:text-6xl">{t.title}</h1>
      <div className="mt-5 h-1 w-16 rounded-full bg-amber-300" />
    </main>
  );
}
