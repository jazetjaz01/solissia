import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Target of the links in Supabase emails (sign-up confirmation, password reset).
// Handles both the default templates (?code=) and token-hash templates.
export async function GET(request: NextRequest, ctx: RouteContext<"/[lang]/auth/confirm">) {
  const { lang } = await ctx.params;
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Only follow paths on this site, never another domain.
  const next = searchParams.get("next");
  const safeNext =
    next?.startsWith("/") && !next.startsWith("//") ? next : `/${lang}/account`;

  const supabase = await createClient();
  let ok = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  }

  redirect(ok ? safeNext : `/${lang}/auth/error`);
}
