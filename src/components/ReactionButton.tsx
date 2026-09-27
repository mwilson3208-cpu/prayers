"use client";

import { useEffect, useState } from "react";
import { postJson, reactedToday, rememberReaction } from "./client-utils";
import { CheckIcon, HandsIcon, HeartIcon } from "./icons";

const COPY = {
  prayed: {
    idle: "I prayed for this",
    done: "You prayed today",
    thanks: "Thank you for praying.",
    already: "You already prayed for this today. Thank you.",
    unit: ["person prayed", "people prayed"],
    url: (id: string) => `/api/prayers/${id}/pray`,
    Icon: HandsIcon,
  },
  praise: {
    idle: "Praise God",
    done: "You praised God",
    thanks: "Praise God! Thank you for celebrating.",
    already: "You already praised God for this today.",
    unit: ["praise", "praises"],
    url: (id: string) => `/api/testimonies/${id}/praise`,
    Icon: HeartIcon,
  },
} as const;

export function ReactionButton({ kind, id, initialCount }: { kind: "prayed" | "praise"; id: string; initialCount: number }) {
  const c = COPY[kind];
  const [count, setCount] = useState(initialCount);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (reactedToday(kind, id)) setDone(true);
  }, [kind, id]);

  async function react() {
    if (busy) return;
    if (done) {
      setMessage(c.already);
      return;
    }
    setBusy(true);
    const res = await postJson<{ count?: number; already?: boolean }>(c.url(id));
    setBusy(false);
    if (!res.ok) {
      setMessage(res.error);
      return;
    }
    rememberReaction(kind, id);
    setDone(true);
    if (typeof res.count === "number") {
      setCount(res.count);
      setMessage(c.thanks);
    } else {
      setMessage(c.already);
    }
  }

  const Icon = done ? CheckIcon : c.Icon;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={react}
        disabled={busy}
        aria-pressed={done}
        className={done ? "btn border border-accent/60 bg-transparent text-accent-ink" : "btn-primary"}
      >
        <Icon /> {done ? c.done : c.idle}
      </button>
      <span className="text-base text-muted" aria-live="polite">
        <strong className="text-fg">{count.toLocaleString("en-US")}</strong> {count === 1 ? c.unit[0] : c.unit[1]}
      </span>
      {message && (
        <p className="w-full text-base font-medium text-accent-ink" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
