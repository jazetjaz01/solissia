import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "../dictionaries";

// Photos of the products, in the order of the dictionary's "products" list
// (Robusta, Arabica). null = brown block until a photo is added,
// e.g. "/images/cafe/robusta.jpg".
const productImages = [null, null];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { cafe } = await getDictionary();
  return pageMetadata(locale, "/cafe", cafe.metadata);
}

export default async function CafePage() {
  const { cafe } = await getDictionary();
  return <ProductPage content={cafe} images={productImages} />;
}
