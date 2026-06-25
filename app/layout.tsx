import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Maman",
  description: "Célébrons ensemble ce jour spécial — 30 août 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Maman",
  },
  openGraph: {
    title: "Maman",
    description: "Célébrons ensemble ce jour spécial — 30 août 2026",
    type: "website",
  },
  icons: {
    icon: "/favicon-birthday.svg",
    apple: [{ url: "/favicon-birthday.svg" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#B87A6A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon" href="/favicon-birthday.svg" />
        <link rel="apple-touch-icon" href="/favicon-birthday.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="h-full animated-gradient font-sans">
        {/* Background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="orb w-96 h-96 bg-primary" style={{ top: "-8%", right: "-12%", opacity: 0.18 }} />
          <div className="orb w-80 h-80 bg-secondary" style={{ top: "35%", left: "-18%", opacity: 0.14 }} />
          <div className="orb w-72 h-72 bg-accent-sage" style={{ bottom: "22%", right: "4%", opacity: 0.14 }} />
          <div className="orb w-64 h-64 bg-accent-gold" style={{ bottom: "-4%", left: "18%", opacity: 0.16 }} />
        </div>

        <main className="relative min-h-full pb-32">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
