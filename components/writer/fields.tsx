import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Same look as the contact form fields.
export const inputClass =
  "w-full bg-stone-100 px-4 text-base text-black outline-none transition placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-amber-300";

export const Field = ({
  id,
  label,
  optional,
  hint,
  className,
  children,
}: {
  id?: string;
  label: string;
  optional?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("grid gap-2", className)}>
    <label htmlFor={id} className="text-sm font-medium uppercase tracking-wide text-black">
      {label}
      {optional && (
        <span className="ms-1 font-normal normal-case tracking-normal text-black/50">({optional})</span>
      )}
    </label>
    {children}
    {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
  </div>
);

// Page frame of the author area: back link, title, content.
export const WriterPage = ({
  back,
  title,
  intro,
  children,
}: {
  back: { href: string; label: string };
  title: string;
  intro?: string;
  children: ReactNode;
}) => (
  <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
    <Link href={back.href} className="text-sm text-black hover:underline hover:underline-offset-4">
      ← {back.label}
    </Link>
    <h1 className="mt-6 text-3xl font-semibold text-black sm:text-4xl">{title}</h1>
    <div className="mt-4 h-1 w-16 rounded-full bg-amber-300" />
    {intro && <p className="mt-6 text-muted-foreground">{intro}</p>}
    {children}
  </main>
);
