"use client";

import { usePathname } from "next/navigation";

/** Renders its children everywhere except on paths starting with `prefix`. */
export function HideOn({ prefix, children }: { prefix: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname?.startsWith(prefix) ? null : <>{children}</>;
}
