import type { ReactNode } from "react";

export const AuthCard = ({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
}) => (
  <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
    <div className="w-full max-w-md">
      <h1 className="text-center text-3xl font-semibold">{title}</h1>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-300" />
      {intro && <p className="mt-6 text-center text-muted-foreground">{intro}</p>}
      <div className="mt-8">{children}</div>
      {footer && (
        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  </main>
);
