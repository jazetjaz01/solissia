import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal-document";
import { getDictionary, getLocale } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { legal } = await getDictionary();
  return legal.metadata;
}

export default async function LegalPage() {
  const locale = await getLocale();
  const { legal } = await getDictionary();

  return (
    <LegalDocument
      locale={locale}
      homeLabel={legal.breadcrumbHome}
      title={legal.title}
      sections={legal.sections as LegalSection[]}
    />
  );
}
