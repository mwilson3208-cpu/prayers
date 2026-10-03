import { FAQ } from "@/lib/content";
import { FaqJsonLd } from "./JsonLd";

/** Visible FAQ (same look as the 7-Day Guide page) plus matching FAQPage structured data. */
export function Faq({ id = "faq", title = "Questions about prayer requests" }: { id?: string; title?: string }) {
  return (
    <section aria-labelledby={id} className="mx-auto mt-16 max-w-3xl px-4">
      <FaqJsonLd />
      <h2 id={id} className="text-3xl">
        {title}
      </h2>
      <div className="mt-6 space-y-3">
        {FAQ.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-line bg-surface p-5">
            <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {f.q}
                <span aria-hidden className="text-2xl text-accent-ink transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
