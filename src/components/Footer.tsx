import Link from "next/link";
import { SCRIPTURE, SITE, youtubeLinks } from "@/lib/content";
import { HideOn } from "./HideOn";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const yt = youtubeLinks();
  return (
    <footer className="mt-20 border-t border-line bg-bg-deep">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <HideOn prefix="/guide">
          <section aria-labelledby="guide-heading" className="card mb-12 grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="eyebrow">Free for you</p>
              <h2 id="guide-heading" className="mt-2 text-2xl sm:text-3xl">
                The 7-Day Prayer Guide
              </h2>
              <p className="mt-3 text-muted">Seven days, seven minutes each. One verse, one teaching, one guided prayer, and one action each day. Free PDF download.</p>
            </div>
            <NewsletterForm />
          </section>
        </HideOn>

        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-serif text-xl">{SITE.name}</p>
            <p className="mt-2 text-base text-muted">{SITE.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="space-y-1 text-base">
              {[
                ["/submit", "Submit a Prayer"],
                ["/prayer-wall", "Prayer Wall"],
                ["/answered", "Give Thanks"],
                ["/scripture", "Scripture"],
                ["/guide", "7-Day Prayer Guide"],
                ["/about", "About and Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="inline-block py-1.5 text-muted hover:text-fg">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-base">
            <ul className="space-y-1">
              <li>
                <a href={yt.channel} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 text-muted hover:text-fg">
                  YouTube channel
                </a>
              </li>
              {SITE.social
                .filter((s) => s.label !== "YouTube")
                .map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 text-muted hover:text-fg">
                      {s.label}
                    </a>
                  </li>
                ))}
              <li>
                <Link href="/privacy" className="inline-block py-1.5 text-muted hover:text-fg">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="inline-block py-1.5 text-muted hover:text-fg">
                  Terms of use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-sm text-muted">
          In crisis? Call or text <a href="tel:988" className="underline">988</a> (Suicide and Crisis Lifeline, US) any time.
        </p>
        <p className="mt-4 text-xs leading-relaxed text-muted/80">{SCRIPTURE.copyrightNotice}</p>
        <p className="mt-2 text-xs text-muted/80">
          &copy; {new Date().getFullYear()} {SITE.name}. Free forever. No ads.
        </p>
      </div>
    </footer>
  );
}
