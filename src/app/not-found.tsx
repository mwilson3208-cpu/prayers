import Link from "next/link";
import { Scripture } from "@/components/Scripture";

export default function NotFound() {
  return (
    <div className="glow">
      <div className="mx-auto max-w-xl px-4 pt-16 text-center">
        <h1 className="text-4xl">We could not find that page.</h1>
        <p className="mt-4 text-muted">It may have moved, or the prayer request may no longer be public.</p>
        <div className="mx-auto mt-8 max-w-md text-left">
          <Scripture verse={{ reference: "Luke 15:4", text: "What man of you, having a hundred sheep, if he has lost one of them, does not leave the ninety-nine in the open country, and go after the one that is lost, until he finds it?" }} size="sm" />
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/prayer-wall" className="btn-secondary">
            Prayer Wall
          </Link>
        </div>
      </div>
    </div>
  );
}
