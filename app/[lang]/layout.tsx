import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { locales } from "@/lib/i18n";
import { getDictionary, getLocale } from "./dictionaries";
import "../globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getDictionary();
  return metadata;
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
