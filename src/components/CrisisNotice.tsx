import { PhoneIcon } from "./icons";

/** Gentle, direct help for anyone in crisis. Shown on the Submit page. */
export function CrisisNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-base text-muted">
        In crisis or thinking about harming yourself? Call or text <a className="font-semibold text-accent-ink underline" href="tel:988">988</a>{" "}
        any time. In immediate danger, call <a className="font-semibold text-accent-ink underline" href="tel:911">911</a>.
      </p>
    );
  }
  return (
    <div role="alert" className="rounded-2xl border-2 border-accent bg-surface-2 p-5 sm:p-6">
      <h2 className="font-serif text-2xl">You matter, and you are not alone.</h2>
      <p className="mt-3">
        It sounds like you may be carrying something very heavy right now. We are praying for you, and we also want you to talk
        with someone right now. Please reach out.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a href="tel:988" className="btn-primary">
          <PhoneIcon /> Call 988
        </a>
        <a href="sms:988" className="btn-secondary">
          Text 988
        </a>
        <a href="tel:911" className="btn-secondary">
          In danger? Call 911
        </a>
      </div>
      <p className="mt-4 text-base text-muted">
        The 988 Suicide and Crisis Lifeline is free, confidential, and open 24 hours a day in the United States. Outside the
        US, please call your local emergency number. You can also call a trusted friend, pastor, or family member right now.
      </p>
    </div>
  );
}
