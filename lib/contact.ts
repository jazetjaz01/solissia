// Solissia's contact details, shown next to the contact form.
// Leave a value empty to hide that block.
export const contactInfo = {
  address: ["Solissia", "7 avenue de Banyuls-sur-Mer", "66100 Perpignan"],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=7+avenue+de+Banyuls-sur-Mer+66100+Perpignan",
  phone: "06 16 22 46 82",
  email: "alami@solissia.com",
};

export const contactSubjects = [
  "sourcing",
  "buy",
  "sell",
  "partnership",
  "other",
] as const;

export type ContactSubject = (typeof contactSubjects)[number];
