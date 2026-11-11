import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal-document";
import { getDictionary, getLocale } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { privacy } = await getDictionary();
  return privacy.metadata;
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const { privacy } = await getDictionary();

  return (
    <LegalDocument
      locale={locale}
      homeLabel={privacy.breadcrumbHome}
      title={privacy.title}
      updated={privacy.updated}
      sections={privacy.sections as LegalSection[]}
    />
  );
}
