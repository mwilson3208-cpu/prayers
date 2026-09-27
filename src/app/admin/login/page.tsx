import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminPassword, isAdmin } from "@/lib/admin-auth";
import { isDemoMode } from "@/lib/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = Boolean(adminPassword());
  return (
    <div className="mx-auto max-w-md px-4 pt-16">
      <div className="card">
        <h1 className="text-3xl">Admin</h1>
        {configured ? (
          <>
            <p className="mt-2 text-muted">Enter the admin password to review prayers and testimonies.</p>
            {isDemoMode && <p className="mt-2 text-base text-accent-ink">Demo mode: the password is &ldquo;demo&rdquo;.</p>}
            <LoginForm />
          </>
        ) : (
          <p className="mt-3">
            The admin dashboard is turned off because no ADMIN_PASSWORD is set. Add it in your Vercel environment variables and
            redeploy.
          </p>
        )}
      </div>
    </div>
  );
}
