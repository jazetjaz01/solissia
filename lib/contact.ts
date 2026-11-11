// Solissia's contact details, shown next to the contact form.
// Leave a value empty to hide that block.
export const contactInfo = {
  address: [] as string[], // e.g. ["Solissia", "12 rue Exemple", "75000 Paris"]
  mapUrl: "", // e.g. a Google Maps link
  phone: "", // e.g. "06 00 00 00 00"
  email: "", // e.g. "contact@solissia.com"
};

export const contactSubjects = [
  "sourcing",
  "buy",
  "sell",
  "partnership",
  "other",
] as const;

export type ContactSubject = (typeof contactSubjects)[number];
