import { cacheLife } from "next/cache";
import Link from "next/link";
import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";
import { Logo } from "@/components/logo";
import { format } from "@/lib/i18n";

const links = [
  { key: "about", href: "#about" },
  { key: "contact", href: "/contact" },
  { key: "legal", href: "/legal" },
  { key: "privacy", href: "#confidentialite" },
] as const;

const getCurrentYear = async () => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};

const Footer = async () => {
  const locale = await getLocale();
  const { footer } = await getDictionary();
  const year = await getCurrentYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) divide-y px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 pt-3 pb-5 sm:flex-row">
          <Logo />

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium text-sm">
            {links.map(({ key, href }) => (
              <li key={key}>
                <Link href={`/${locale}${href}`}>{footer[key]}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center pt-4 pb-2 sm:justify-start">
          <p className="font-medium text-muted-foreground text-sm">
            {format(footer.copyright, { year })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
