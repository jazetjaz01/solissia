import Image from "next/image";
import { HomeSlider } from "@/components/home-slider";
import type { Metadata } from "next";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "./dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { metadata } = await getDictionary();
  return pageMetadata(
    locale,
    "",
    { title: metadata.homeTitle, description: metadata.description },
    { absoluteTitle: true },
  );
}

export default async function Home() {
  const locale = await getLocale();
  const { home } = await getDictionary();
  const jsonLd = await organizationJsonLd(locale);

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="relative -mt-16 h-[calc(60vh+4rem)]">
        <Image
          src="/images/home/home1.jpg"
          alt={home.imageAlts.hero}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex h-full max-w-(--breakpoint-2xl) items-center justify-center px-4 pt-16 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-center text-3xl font-semibold leading-tight text-white sm:text-6xl">
            {home.hero}
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-5xl text-center text-xl leading-relaxed text-black sm:text-4xl font-semibold ">
          {home.intro.lead}
        </p>
        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-center text-lg leading-relaxed text-muted-foreground">
          {home.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <HomeSlider content={home.slider} />
      <section className="mx-auto grid max-w-(--breakpoint-2xl) items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-0 md:pb-0 md:px-[calc(1.5rem+3.25rem)] lg:px-[calc(2rem+3.25rem)]">
        <div className="relative h-64 sm:h-80 md:h-[480px]">
          <Image
            src="/images/home/sourcing1.jpg"
            alt={home.imageAlts.sourcing}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="md:px-10 lg:px-16">
          <h2 className="text-center text-2xl font-semibold leading-tight text-black sm:text-4xl">
            {home.sourcing.title}
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-amber-300" />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-black/80">
            {home.sourcing.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-(--breakpoint-2xl) items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-0 md:pt-0 md:px-[calc(1.5rem+3.25rem)] lg:px-[calc(2rem+3.25rem)]">
        <div className="relative h-64 sm:h-80 md:order-last md:h-[480px]">
          <Image
            src="/images/home/sourcing2.jpg"
            alt={home.imageAlts.custom}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="md:px-10 lg:px-16">
          <h2 className="text-center text-2xl font-semibold leading-tight text-black sm:text-4xl">
            {home.custom.title}
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-amber-300" />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-black/80">
            {home.custom.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
