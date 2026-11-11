"use client";

// Asks for confirmation before deleting: the deletion can't be undone.
export const DeleteButton = ({ label, confirmMessage }: { label: string; confirmMessage: string }) => (
  <button
    type="submit"
    onClick={(event) => {
      if (!window.confirm(confirmMessage)) event.preventDefault();
    }}
    className="text-destructive underline underline-offset-4"
  >
    {label}
  </button>
);
