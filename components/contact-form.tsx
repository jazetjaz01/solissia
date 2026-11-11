"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, type ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { sendContactMessage } from "@/app/[lang]/contact/actions";
import { contactSubjects } from "@/lib/contact";
import { cn } from "@/lib/utils";

const labelClass = "block text-sm font-medium uppercase tracking-wide text-black";
const fieldClass =
  "w-full bg-stone-100 px-5 text-base text-black outline-none transition placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-amber-300";

const Field = ({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("space-y-3", className)}>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    {children}
  </div>
);

export const ContactForm = ({
  lang,
  t,
}: {
  lang: string;
  t: Dictionary["contact"];
}) => {
  const [state, formAction, pending] = useActionState(sendContactMessage, null);
  const values = state?.values;

  if (state?.success) {
    return (
      <p role="status" className="bg-emerald-50 p-6 text-lg text-emerald-900">
        {t.success}
      </p>
    );
  }

  return (
    <form
      action={formAction}
      // With JavaScript, submit without React's automatic form reset so that
      // nothing typed is lost on error. Without it, the action still works.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      <input type="hidden" name="lang" value={lang} />
      {/* Honeypot for spam bots: invisible and skipped by keyboard and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="subject" label={t.subject.label} className="sm:col-span-2">
        <div className="relative">
          <select
            id="subject"
            name="subject"
            required
            defaultValue={values?.subject ?? ""}
            className="h-14 w-full appearance-none border-2 border-black bg-white pr-12 pl-5 text-base text-black outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <option value="" disabled>
              {t.subject.placeholder}
            </option>
            {contactSubjects.map((key) => (
              <option key={key} value={key}>
                {t.subject.options[key]}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-5 size-5 -translate-y-1/2"
          />
        </div>
      </Field>

      <Field id="firstName" label={t.firstName}>
        <input
          id="firstName"
          name="firstName"
          required
          maxLength={100}
          autoComplete="given-name"
          placeholder={t.firstName}
          defaultValue={values?.firstName}
          className={cn(fieldClass, "h-14")}
        />
      </Field>
      <Field id="lastName" label={t.lastName}>
        <input
          id="lastName"
          name="lastName"
          required
          maxLength={100}
          autoComplete="family-name"
          placeholder={t.lastName}
          defaultValue={values?.lastName}
          className={cn(fieldClass, "h-14")}
        />
      </Field>
      <Field id="email" label={t.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          placeholder={t.email}
          defaultValue={values?.email}
          className={cn(fieldClass, "h-14")}
        />
      </Field>
      <Field
        id="phone"
        label={
          <>
            {t.phone}{" "}
            <span className="font-normal normal-case tracking-normal text-black/50">
              ({t.optional})
            </span>
          </>
        }
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          maxLength={40}
          autoComplete="tel"
          placeholder={t.phone}
          defaultValue={values?.phone}
          className={cn(fieldClass, "h-14")}
        />
      </Field>

      <Field id="message" label={t.message} className="sm:col-span-2">
        <textarea
          id="message"
          name="message"
          required
          rows={8}
          maxLength={5000}
          placeholder={t.messagePlaceholder}
          defaultValue={values?.message}
          className={cn(fieldClass, "resize-y py-4")}
        />
      </Field>

      <fieldset className="space-y-4 sm:col-span-2">
        <legend className={labelClass}>{t.consent.title}</legend>
        <label className="flex cursor-pointer items-start gap-3 text-black/70">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={state?.consented}
            className="mt-0.5 size-5 shrink-0 accent-black"
          />
          {t.consent.label}
        </label>
        <p className="pl-8 text-sm text-black/60">
          <Link
            href={`/${lang}/privacy`}
            target="_blank"
            className="underline underline-offset-4 decoration-black/30 hover:decoration-black"
          >
            {t.consent.privacyLink}
          </Link>
        </p>
      </fieldset>

      {state?.error && (
        <p role="alert" className="bg-destructive/10 p-4 text-destructive sm:col-span-2">
          {t.errors[state.error]}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="h-14 border-2 border-black px-14 text-sm font-medium uppercase tracking-[0.2em] text-black transition-colors outline-none hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-50"
        >
          {pending ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
};
