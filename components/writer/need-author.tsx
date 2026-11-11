import Link from "next/link";
import { getDictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";

// Shown instead of the editor while the writer has no author profile.
export const NeedAuthor = async ({ locale }: { locale: Locale }) => {
  const { writer } = await getDictionary();
  return (
    <div className="mt-10 border-l-4 border-amber-300 bg-amber-50 p-6">
      <p className="text-black">{writer.needAuthor}</p>
      <Link
        href={`/${locale}/account/author`}
        className="mt-4 inline-block text-sm font-medium text-black underline underline-offset-4"
      >
        {writer.createAuthor}
      </Link>
    </div>
  );
};
