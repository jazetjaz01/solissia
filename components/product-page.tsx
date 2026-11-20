import Image from "next/image";

export type ProductPageContent = {
  title: string;
  paragraphs: string[];
  products: { title: string; imageAlt: string; paragraphs: string[]; varieties?: string[] }[];
};

// Product range page (cacao, café): a banner under the transparent navbar,
// an introduction, then one section per product laid out like the home page,
// the image switching sides from one product to the next.
// `images` follows the order of `products`; null shows a plain brown block
// until a photo is added.
export const ProductPage = ({
  content: t,
  images,
}: {
  content: ProductPageContent;
  images: (string | null)[];
}) => (
  <main className="flex-1">
    <section className="relative -mt-16 h-[calc(20vh+4rem)] bg-[#3b2416]">
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
    <div className="pb-12 md:pb-24">
      {t.products.map((product, index) => {
        const image = images[index];
        return (
          <section
            key={product.title}
            className="mx-auto grid max-w-(--breakpoint-2xl) items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-0 md:py-0 md:px-[calc(1.5rem+3.25rem)] lg:px-[calc(2rem+3.25rem)]"
          >
            <div
              className={`relative h-64 sm:h-80 md:h-[480px] ${index % 2 === 1 ? "md:order-last" : ""} ${image ? "" : "bg-[#3b2416]"}`}
            >
              {image && (
                <Image
                  src={image}
                  alt={product.imageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="md:px-10 lg:px-16">
              <h2 className="text-center text-2xl font-semibold leading-tight text-black sm:text-4xl">
                {product.title}
              </h2>
              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-amber-300" />
              <div className="mt-8 space-y-4 text-lg leading-relaxed text-black/80">
                {product.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {product.varieties && (
                  <ul className="space-y-2">
                    {product.varieties.map((variety) => (
                      <li key={variety} className="flex gap-3">
                        <span aria-hidden="true" className="mt-3 h-0.5 w-4 shrink-0 bg-amber-300" />
                        <span>{variety}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  </main>
);
