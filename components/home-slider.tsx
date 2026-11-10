"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { format } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Titles and texts come from the dictionaries, in the same order.
const slideStyles = [
  {
    image: "/images/home/slide1.jpg",
    href: "#",
    panelClassName: "bg-muted",
    imageFirst: true,
  },
  {
    image: "/images/home/slide2.jpg",
    href: "#",
    panelClassName: "bg-amber-100",
    imageFirst: false,
  },
];

export const HomeSlider = ({
  content,
}: {
  content: Dictionary["home"]["slider"];
}) => {
  const slides = slideStyles.map((style, index) => ({
    ...style,
    ...content.slides[index],
  }));
  const [current, setCurrent] = useState(0);
  const isFirst = current === 0;
  const isLast = current === slides.length - 1;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={content.label}
      className="mx-auto flex max-w-(--breakpoint-2xl) items-center gap-4 px-4 py-12 sm:px-6 lg:px-8"
    >
      <Button
        variant="outline"
        size="icon-lg"
        className="hidden rounded-full md:inline-flex"
        onClick={() => setCurrent(current - 1)}
        disabled={isFirst}
        aria-label={content.previous}
      >
        <ChevronLeft />
      </Button>

      <div className="min-w-0 flex-1">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.image}
                role="group"
                aria-roledescription="slide"
                aria-label={format(content.position, {
                  n: index + 1,
                  total: slides.length,
                })}
                aria-hidden={index !== current}
                inert={index !== current}
                className="grid w-full shrink-0 md:h-[420px] md:grid-cols-[3fr_2fr]"
              >
                <div
                  className={cn(
                    "relative h-56 sm:h-72 md:h-full",
                    !slide.imageFirst && "md:order-last",
                  )}
                >
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-6 p-8 text-center",
                    slide.panelClassName,
                  )}
                >
                  <h2 className="text-2xl font-semibold leading-tight text-black sm:text-3xl">
                    {slide.title}
                  </h2>
                  <p className="max-w-sm text-black/80">{slide.text}</p>
                  <Link
                    href={slide.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-black"
                  >
                    {content.learnMore}
                    <span className="flex size-6 items-center justify-center rounded-full bg-white">
                      <ChevronRight className="size-4" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={format(content.goTo, { n: index + 1 })}
              aria-current={index === current}
              className={cn(
                "size-2.5 rounded-full transition-colors",
                index === current ? "bg-foreground" : "bg-foreground/25",
              )}
            />
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon-lg"
        className="hidden rounded-full md:inline-flex"
        onClick={() => setCurrent(current + 1)}
        disabled={isLast}
        aria-label={content.next}
      >
        <ChevronRight />
      </Button>
    </section>
  );
};
