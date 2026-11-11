import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, localeCookie, locales } from "@/lib/i18n";
import { redirectWithSession, updateSession } from "@/lib/supabase/proxy";

// Pages reserved to signed-in users, after the language (/fr/account).
const protectedPaths = ["/account", "/update-password"];

// Language chosen with the flags first, then the browser's preferred languages.
function getLocale(request: NextRequest) {
  const saved = request.cookies.get(localeCookie)?.value;
  if (saved && hasLocale(saved)) return saved;

  const preferred = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .find(({ lang }) => hasLocale(lang));

  return preferred && hasLocale(preferred.lang) ? preferred.lang : defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!locale) {
    request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const { response, claims } = await updateSession(request);

  const path = pathname.slice(locale.length + 1);
  const isProtected = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  );
  if (isProtected && !claims) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.search = "";
    return redirectWithSession(url, response);
  }

  return response;
}

export const config = {
  // Skip Next.js internals and files in public/ (anything with an extension).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
