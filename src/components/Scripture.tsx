import type { Verse } from "@/lib/content";

/** A verse shown as the reason a page exists, not as decoration. */
export function Scripture({ verse, size = "md", className = "" }: { verse: Verse; size?: "sm" | "md" | "lg"; className?: string }) {
  const text = { sm: "text-lg", md: "text-xl sm:text-2xl", lg: "text-2xl sm:text-3xl" }[size];
  return (
    <figure className={`border-l-2 border-accent pl-4 sm:pl-5 ${className}`}>
      <blockquote className={`font-serif italic leading-snug text-fg ${text}`}>
        <p>&ldquo;{verse.text}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-2 text-base font-semibold text-accent-ink">{verse.reference}</figcaption>
    </figure>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  verses,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  verses?: Verse[];
}) {
  return (
    <header className="glow">
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-8 sm:pt-16">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 text-lg text-muted sm:text-xl">{lead}</p>}
        {verses && verses.length > 0 && (
          <div className="mt-8 space-y-6">
            {verses.map((v) => (
              <Scripture key={v.reference} verse={v} size="sm" />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
