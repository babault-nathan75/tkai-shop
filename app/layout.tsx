import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { Providers } from "@/components/Providers";

const BASE_URL = "https://tkai-shop.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "T-KAI | Otaku Streetwear — T-shirts, Hoodies & Accessoires Manga",
    template: "%s | T-KAI Shop",
  },
  description:
    "Boutique otaku streetwear : t-shirts, hoodies, casquettes et accessoires personnalisés inspirés manga et anime. Livraison rapide. Custom Lab disponible.",
  keywords: [
    "otaku",
    "streetwear",
    "manga",
    "anime",
    "t-shirt",
    "hoodie",
    "casquette",
    "personnalisé",
    "custom",
    "boutique en ligne",
    "T-KAI",
    "figurine",
    "accessoire",
  ],
  authors: [{ name: "T-KAI" }],
  creator: "T-KAI",
  publisher: "T-KAI",
  applicationName: "T-KAI",
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "T-KAI Shop",
    title: "T-KAI | Otaku Streetwear — T-shirts, Hoodies & Accessoires Manga",
    description:
      "Boutique otaku streetwear : t-shirts, hoodies, casquettes et accessoires personnalisés inspirés manga et anime.",
    images: [
      {
        url: "/logo-tkai.jpeg",
        width: 1200,
        height: 630,
        alt: "T-KAI Shop — Otaku Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T-KAI | Otaku Streetwear",
    description:
      "Boutique otaku streetwear : t-shirts, hoodies, casquettes et accessoires personnalisés inspirés manga et anime.",
    images: ["/logo-tkai.jpeg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/logo-tkai.jpeg",
    shortcut: "/logo-tkai.jpeg",
    apple: "/logo-tkai.jpeg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className="pb-[72px] md:pb-0">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Suspense fallback={<footer className="h-48 border-t border-white/10 bg-black" />}>
            <Footer />
          </Suspense>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
