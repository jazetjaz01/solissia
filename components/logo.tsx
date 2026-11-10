import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";

export const Logo = async () => {
  const locale = await getLocale();
  const { nav } = await getDictionary();

  return (
    <Link href={`/${locale}`} aria-label={nav.logoLabel} className="flex items-center gap-2">
      <Image
        src="/solissia-logo-200.svg"
        alt=""
        width={48}
        height={48}
        priority
        className="group-data-[transparent=true]/navbar:brightness-0 group-data-[transparent=true]/navbar:invert"
      />
      <span className="text-2xl font-semibold tracking-tight">solissia</span>
    </Link>
  );
};
