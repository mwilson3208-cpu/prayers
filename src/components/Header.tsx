import Link from "next/link";
import { SITE } from "@/lib/content";
import { LogoMark } from "./icons";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export const NAV = [
  { href: "/submit", label: "Submit a Prayer" },
  { href: "/prayer-wall", label: "Prayer Wall" },
  { href: "/answered", label: "Give Thanks" },
  { href: "/7days", label: "Prayer Guide" },
  { href: "/scripture", label: "Scripture" },
  { href: "/watch", label: "Watch" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2">
        <Link href="/" className="flex min-h-12 items-center gap-2.5 text-fg" aria-label={`${SITE.name} home`}>
          <LogoMark width={34} height={34} className="text-accent" />
          <span className="font-serif text-lg leading-tight font-semibold sm:text-xl">{SITE.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-lg px-3 py-2 text-base text-muted hover:bg-surface hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center">
          <ThemeToggle />
          <MobileMenu items={NAV} />
        </div>
      </div>
    </header>
  );
}
