import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" aria-label="Solissia - Accueil">
    <Image
      src="/solissia-logo-200.svg"
      alt="Solissia"
      width={48}
      height={48}
      priority
    />
  </Link>
);
