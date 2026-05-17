import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "T-KAI | Otaku Streetwear",
  description: "T-shirts, casquettes et articles personnalisés otaku.",
  applicationName: "T-KAI",
  formatDetection: {
    telephone: false,
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
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
