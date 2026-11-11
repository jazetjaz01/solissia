import type { ReactNode } from "react";

// Sidebar title: short yellow line + uppercase label, as on the contact page.
export const SectionTitle = ({ id, children }: { id?: string; children: ReactNode }) => (
  <h2 id={id} className="flex items-center gap-4 text-sm font-medium uppercase tracking-wide text-black">
    <span aria-hidden="true" className="h-0.5 w-8 bg-amber-300" />
    {children}
  </h2>
);
