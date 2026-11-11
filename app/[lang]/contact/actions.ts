"use server";

import { Resend } from "resend";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import fr from "@/app/[lang]/dictionaries/fr.json";
import { contactSubjects, type ContactSubject } from "@/lib/contact";

export type ContactErrorKey = keyof Dictionary["contact"]["errors"];
export type ContactValues = Record<
  "subject" | "firstName" | "lastName" | "email" | "phone" | "message",
  string
>;
export type ContactState = {
  error?: ContactErrorKey;
  success?: boolean;
  // Sent back on error so the form keeps what the visitor typed.
  values?: ContactValues;
  consented?: boolean;
} | null;

const maxLengths: Record<keyof ContactValues, number> = {
  subject: 20,
  firstName: 100,
  lastName: 100,
  email: 200,
  phone: 40,
  message: 5000,
};

const isSubject = (value: string): value is ContactSubject =>
  (contactSubjects as readonly string[]).includes(value);

// Header fields must stay on a single line.
const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

export async function sendContactMessage(
  _: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const read = (name: keyof ContactValues) =>
    String(formData.get(name) ?? "").trim().slice(0, maxLengths[name]);

  const values: ContactValues = {
    subject: read("subject"),
    firstName: oneLine(read("firstName")),
    lastName: oneLine(read("lastName")),
    email: oneLine(read("email")),
    phone: oneLine(read("phone")),
    message: read("message"),
  };

  // Honeypot: hidden from people, often filled in by spam bots.
  if (formData.get("website")) return { success: true };

  const consented = formData.get("consent") === "on";
  const fail = (error: ContactErrorKey): ContactState => ({ error, values, consented });

  const { subject, firstName, lastName, email, phone, message } = values;
  if (!isSubject(subject) || !firstName || !lastName || !email || !message) {
    return fail("missing_fields");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("invalid_email");
  }
  if (!consented) return fail("consent");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Contact form: RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is missing.");
    return fail("generic");
  }

  // The team reads the emails in French, whatever the site language.
  const subjectLabel = fr.contact.subject.options[subject];
  const lang = String(formData.get("lang") ?? "");

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: email,
    subject: `[Contact] ${subjectLabel} – ${firstName} ${lastName}`,
    text: [
      `Objet : ${subjectLabel}`,
      `Nom : ${firstName} ${lastName}`,
      `E-mail : ${email}`,
      `Téléphone : ${phone || "-"}`,
      `Langue du site : ${lang || "-"}`,
      "",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("Contact form: Resend error", error);
    return fail("generic");
  }

  return { success: true };
}
