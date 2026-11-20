import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "../dictionaries";

// Photos of the products, in the order of the dictionary's "products" list.
const productImages = [
  "/images/cacao/cacao1.jpg",
  "/images/cacao/beurre2.jpg",
  "/images/cacao/poudre3.jpg",
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { cacao } = await getDictionary();
  return pageMetadata(locale, "/cacao", cacao.metadata);
}

export default async function CacaoPage() {
  const { cacao } = await getDictionary();
  return <ProductPage content={cacao} images={productImages} />;
}
