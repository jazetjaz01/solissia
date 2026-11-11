"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { defaultLocale, hasLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export type AuthErrorKey = keyof Dictionary["auth"]["errors"];
export type AuthState = { error?: AuthErrorKey; success?: boolean } | null;

const knownErrors = new Set<string>([
  "invalid_credentials",
  "email_not_confirmed",
  "weak_password",
  "same_password",
  "over_email_send_rate_limit",
]);

const toErrorKey = (code: string | undefined): AuthErrorKey =>
  code && knownErrors.has(code) ? (code as AuthErrorKey) : "generic";

// Server Actions can't read root params, so the forms send the language.
const getLang = (formData: FormData) => {
  const lang = String(formData.get("lang") ?? "");
  return hasLocale(lang) ? lang : defaultLocale;
};

const getField = (formData: FormData, name: string) =>
  String(formData.get(name) ?? "").trim();

// Where the links in Supabase emails come back to.
const confirmUrl = async (lang: string, next: string) => {
  const origin = (await headers()).get("origin");
  return `${origin}/${lang}/auth/confirm?next=${encodeURIComponent(next)}`;
};

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const lang = getLang(formData);
  const email = getField(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "missing_fields" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: toErrorKey(error.code) };

  redirect(`/${lang}/account`);
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const lang = getLang(formData);
  const email = getField(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "missing_fields" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: await confirmUrl(lang, `/${lang}/account`) },
  });
  if (error) return { error: toErrorKey(error.code) };

  return { success: true };
}

export async function requestPasswordReset(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const lang = getLang(formData);
  const email = getField(formData, "email");
  if (!email) return { error: "missing_fields" };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: await confirmUrl(lang, `/${lang}/update-password`),
  });
  if (error) return { error: toErrorKey(error.code) };

  return { success: true };
}

export async function updatePassword(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "missing_fields" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: toErrorKey(error.code) };

  return { success: true };
}

export async function logout(formData: FormData) {
  const lang = getLang(formData);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${lang}`);
}
