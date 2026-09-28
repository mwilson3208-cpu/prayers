"use client";

import { usePathname } from "next/navigation";

/** Renders its children everywhere except on paths starting with any of `prefixes`. */
export function HideOn({ prefixes, children }: { prefixes: string[]; children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  return prefixes.some((p) => pathname.startsWith(p)) ? null : <>{children}</>;
}
