import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" aria-label="Solissia - Accueil" className="flex items-center gap-2">
    <Image
      src="/solissia-logo-200.svg"
      alt=""
      width={48}
      height={48}
      priority
    />
    <span className="text-2xl font-semibold tracking-tight">solissia</span>
  </Link>
);
