import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  role: "member" | "writer";
};

// Signed-in user (session verified with getClaims) and their role.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: claims.sub,
    email: claims.email ?? "",
    role: profile?.role === "writer" ? "writer" : "member",
  };
}

// Pages and actions reserved for writers.
export async function requireWriter(locale: Locale): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== "writer") redirect(`/${locale}/account`);
  return user;
}
