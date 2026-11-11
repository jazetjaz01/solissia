import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";
import { ContactForm } from "@/components/contact-form";
import { contactInfo } from "@/lib/contact";
import { getDictionary, getLocale } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { contact } = await getDictionary();
  return pageMetadata(locale, "/contact", contact.metadata);
}

const InfoBlock = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <h2 className="flex items-center gap-6 border-b border-black/10 pb-6 text-sm font-medium uppercase tracking-wide text-black">
      <span aria-hidden="true" className="h-0.5 w-12 bg-amber-300" />
      {title}
    </h2>
    <div className="border-b border-black/10 py-6 text-lg text-black">{children}</div>
  </div>
);

const linkClass = "underline underline-offset-4 decoration-black/30 hover:decoration-black";

export default async function ContactPage() {
  const locale = await getLocale();
  const { contact: t } = await getDictionary();
  const { address, mapUrl, phone, email } = contactInfo;
  const hasInfo = address.length > 0 || phone || email;

  return (
    <main className="mx-auto w-full max-w-(--breakpoint-2xl) flex-1 px-4 py-16 sm:px-6 sm:py-24 md:px-[calc(1.5rem+3.25rem)] lg:px-[calc(2rem+3.25rem)]">
      <h1 className="text-4xl font-semibold text-black sm:text-6xl">{t.title}</h1>
      <div className="mt-5 h-1 w-16 rounded-full bg-amber-300" />
      <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {t.intro}
      </p>

      <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_26rem] xl:gap-24">
        <ContactForm lang={locale} t={t} />

        {hasInfo && (
          <aside className="space-y-12 lg:pt-1">
            {address.length > 0 && (
              <InfoBlock title={t.info.address}>
                <address className="not-italic leading-relaxed">
                  {address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                {mapUrl && (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-block text-base ${linkClass}`}>
                    {t.info.map}
                  </a>
                )}
              </InfoBlock>
            )}
            {phone && (
              <InfoBlock title={t.info.phone}>
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
                  {phone}
                </a>
              </InfoBlock>
            )}
            {email && (
              <InfoBlock title={t.info.email}>
                <a href={`mailto:${email}`} className={`break-all ${linkClass}`}>
                  {email}
                </a>
              </InfoBlock>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}
