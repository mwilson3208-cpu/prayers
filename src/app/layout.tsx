import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServiceWorker } from "@/components/ServiceWorker";
import { themeScript } from "@/components/ThemeToggle";
import { SITE } from "@/lib/content";
import { isDemoMode } from "@/lib/env";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap", style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} | Free Prayer Requests and Prayer Wall`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["prayer request", "prayer wall", "pray for me", "answered prayer", "daily devotional", "guided prayer", "Bible verses"],
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1d3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${lora.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        {isDemoMode && (
          <div className="bg-accent px-4 py-2 text-center text-sm font-semibold text-on-accent">
            Demo mode: sample data only. Nothing you submit is saved. Connect Supabase to go live.
          </div>
        )}
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ServiceWorker />
      </body>
    </html>
  );
}
