import type { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { contactInfo } from "@/lib/contact";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

export const siteUrl = "https://www.solissia.com";

// Pages listed in the sitemap, without the language prefix.
export const publicPaths = ["", "/actualite", "/contact", "/legal", "/privacy"] as const;

// Canonical URL of the page plus its versions in the other languages (hreflang),
// so Google shows French searchers /fr and English searchers /en.
export const alternates = (locale: Locale, path: string): Metadata["alternates"] => ({
  canonical: `/${locale}${path}`,
  languages: {
    ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
    "x-default": `/${defaultLocale}${path}`,
  },
});

// Metadata of an indexed page: title, description, canonical, hreflang, social sharing.
export const pageMetadata = async (
  locale: Locale,
  path: string,
  { title, description }: { title: string; description: string },
  { absoluteTitle = false } = {},
): Promise<Metadata> => {
  const { metadata } = await getDictionary();
  const fullTitle = absoluteTitle ? title : `${title} | ${metadata.title}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "Solissia",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `/${locale}${path}`,
      title: fullTitle,
      description,
      images: [{ url: "/images/home/home1.jpg", width: 3000, height: 1300, alt: metadata.ogImageAlt }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
};

// Account and login pages: no point in Google indexing them.
// Not blocked in robots.txt, otherwise Google could not read this noindex.
export const noIndex: Metadata["robots"] = { index: false, follow: false };

// Structured data (schema.org) describing Solissia and its sourcing service.
export const organizationJsonLd = async (locale: Locale) => {
  const { metadata } = await getDictionary();
  const [, street, cityLine] = contactInfo.address;
  const [postalCode, ...city] = cityLine.split(" ");
  const organization = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Solissia",
    url: siteUrl,
    logo: `${siteUrl}/solissia-logo-200.svg`,
    description: metadata.description,
    email: contactInfo.email,
    telephone: `+33 ${contactInfo.phone.slice(1)}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      postalCode,
      addressLocality: city.join(" "),
      addressCountry: "FR",
    },
    knowsAbout: metadata.knowsAbout,
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "Service",
        name: metadata.serviceName,
        serviceType: metadata.serviceName,
        description: metadata.description,
        provider: { "@id": organization["@id"] },
        areaServed: "Worldwide",
        url: `${siteUrl}/${locale}`,
      },
    ],
  };
};
