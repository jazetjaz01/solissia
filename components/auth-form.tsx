"use client";

import { useActionState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { AuthState } from "@/app/[lang]/auth/actions";
import { Button } from "@/components/ui/button";

type Field = {
  name: string;
  label: string;
  type: "email" | "password";
  autoComplete: string;
  hint?: string;
  minLength?: number;
};

export const AuthForm = ({
  action,
  lang,
  fields,
  submitLabel,
  successMessage,
  errors,
}: {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  lang: string;
  fields: Field[];
  submitLabel: string;
  successMessage?: string;
  errors: Dictionary["auth"]["errors"];
}) => {
  const [state, formAction, pending] = useActionState(action, null);

  if (state?.success && successMessage) {
    return (
      <p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-900">
        {successMessage}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="lang" value={lang} />
      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <label htmlFor={field.name} className="block text-sm font-medium">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            minLength={field.minLength}
            required
            aria-describedby={field.hint ? `${field.name}-hint` : undefined}
            className="h-10 w-full rounded-lg border bg-background px-3 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {field.hint && (
            <p id={`${field.name}-hint`} className="text-sm text-muted-foreground">
              {field.hint}
            </p>
          )}
        </div>
      ))}

      {state?.error && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {errors[state.error]}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {submitLabel}
      </Button>
    </form>
  );
};
