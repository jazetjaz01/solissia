import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  {
    title: "À propos",
    href: "/#about",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
  {
    title: "Mentions légales",
    href: "/#mentions-legales",
  },
  {
    title: "Politique de confidentialité",
    href: "/#confidentialite",
  },
];

const CurrentYear = async () => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) divide-y px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 pt-3 pb-5 sm:flex-row">
          <Logo />

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium text-sm">
            {links.map(({ title, href }) => (
              <li key={title}>
                <Link href={href}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center pt-4 pb-2 sm:justify-start">
          <p className="font-medium text-muted-foreground text-sm">
            Copyright &copy; <CurrentYear /> Solissia. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
