import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Lab — Crée ton outfit unique T-KAI",
  description:
    "Personnalise ton t-shirt, hoodie ou casquette avec ton texte, ton image et ta couleur. T-KAI transforme ton idée en pièce unique.",
  openGraph: {
    title: "Custom Lab | T-KAI Shop",
    description:
      "Crée ton outfit unique : ajoute ton texte, ton image et ta couleur. T-KAI réalise ta pièce personnalisée.",
    url: "https://tkai-shop.vercel.app/custom-lab",
  },
  alternates: {
    canonical: "https://tkai-shop.vercel.app/custom-lab",
  },
};

export default function CustomLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
