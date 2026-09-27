"use client";

import { useState } from "react";
import type { Page, PublicPrayer, PublicTestimony } from "@/lib/types";
import { PrayerCard } from "./PrayerCard";
import { TestimonyCard } from "./TestimonyCard";

type Props =
  | { kind: "prayers"; initial: Page<PublicPrayer>; category?: string | null; empty: React.ReactNode }
  | { kind: "testimonies"; initial: Page<PublicTestimony>; empty: React.ReactNode };

/** Server renders the first page; "Show more" loads the next pages. */
export function Feed(props: Props) {
  const [items, setItems] = useState<(PublicPrayer | PublicTestimony)[]>(props.initial.items);
  const [cursor, setCursor] = useState(props.initial.nextCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function more() {
    if (!cursor) return;
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ cursor });
    if (props.kind === "prayers" && props.category) params.set("category", props.category);
    try {
      const res = await fetch(`/api/${props.kind}?${params}`);
      const data = await res.json();
      if (!data.ok) throw new Error();
      setItems((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch {
      setError("Could not load more right now. Please try again.");
    }
    setLoading(false);
  }

  if (!items.length) return <div className="card text-center">{props.empty}</div>;

  return (
    <div>
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item.id}>
            {props.kind === "prayers" ? (
              <PrayerCard prayer={item as PublicPrayer} />
            ) : (
              <TestimonyCard t={item as PublicTestimony} />
            )}
          </li>
        ))}
      </ul>
      {cursor && (
        <div className="mt-8 text-center">
          <button type="button" onClick={more} disabled={loading} className="btn-secondary w-full sm:w-auto">
            {loading ? "Loading..." : "Show more"}
          </button>
        </div>
      )}
      {error && (
        <p className="mt-4 text-center text-accent-ink" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
