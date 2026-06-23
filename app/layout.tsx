import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Maman ❤️",
  description: "Célébrons ensemble ce jour spécial — 30 août 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Maman ❤️",
  },
  openGraph: {
    title: "Maman ❤️",
    description: "Célébrons ensemble ce jour spécial — 30 août 2026",
    type: "website",
  },
  icons: {
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#F4A7B9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="h-full animated-gradient">
        {/* Decorative background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="orb w-96 h-96 bg-primary-pink"
            style={{ top: "-10%", right: "-10%", opacity: 0.25 }}
          />
          <div
            className="orb w-80 h-80 bg-accent-purple"
            style={{ top: "30%", left: "-15%", opacity: 0.2 }}
          />
          <div
            className="orb w-72 h-72 bg-soft-green"
            style={{ bottom: "20%", right: "5%", opacity: 0.2 }}
          />
          <div
            className="orb w-64 h-64 bg-soft-yellow"
            style={{ bottom: "-5%", left: "20%", opacity: 0.25 }}
          />
        </div>

        {/* Main content */}
        <main className="relative min-h-full pb-32">
          {children}
        </main>

        {/* Fixed bottom navigation */}
        <BottomNav />
      </body>
    </html>
  );
}
