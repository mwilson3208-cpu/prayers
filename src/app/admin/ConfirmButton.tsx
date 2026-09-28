"use client";

import { useFormStatus } from "react-dom";

export function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className="btn min-h-11 border border-red-400/50 py-2 text-sm text-red-300 hover:bg-red-900/30 [[data-theme=light]_&]:text-red-700"
    >
      {children}
    </button>
  );
}
