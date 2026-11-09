import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MetaPixel } from "@/components/analytics/MetaPixel";

export const metadata: Metadata = {
  title: "Simaloji — Yüz Analizi",
  description: "14 bölge yüz analizi ile karakterini, mizacını ve güçlü yönlerini keşfet.",
};

export const viewport: Viewport = {
  themeColor: "#F7F5FF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
