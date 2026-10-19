import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site-url";

const canonical = new URL(SITE_URL);
const bare = (host: string) => host.replace(/^www\./, "");

/**
 * Sends www/non-www and http variants of the production domain to the one
 * canonical origin (NEXT_PUBLIC_SITE_URL) with a single 301. Other hosts
 * (localhost, *.vercel.app previews) are left alone.
 */
export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
  if (bare(host) !== bare(canonical.host)) return NextResponse.next();
  if (host === canonical.host && proto === canonical.protocol.replace(":", "")) return NextResponse.next();
  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, canonical.origin);
  return NextResponse.redirect(target, 301);
}

export const config = {
  // Skip build assets and image optimizer requests; everything else is checked.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
