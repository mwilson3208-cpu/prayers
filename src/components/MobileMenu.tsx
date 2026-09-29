"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MenuIcon } from "./icons";

/** Simple dropdown menu for phones. Closes after tapping a link, tapping outside, or pressing Escape. */
export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <details ref={ref} className="relative lg:hidden">
      <summary className="flex h-12 cursor-pointer list-none items-center gap-2 rounded-xl px-3 text-fg hover:bg-surface [&::-webkit-details-marker]:hidden">
        <MenuIcon /> <span className="text-base font-semibold">Menu</span>
      </summary>
      <nav aria-label="Main" className="absolute right-0 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/30">
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => {
                  if (ref.current) ref.current.open = false;
                }}
                className="flex min-h-12 items-center rounded-xl px-4 text-lg hover:bg-surface-2 aria-[current=page]:text-accent-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
