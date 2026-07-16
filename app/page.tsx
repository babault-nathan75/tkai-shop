import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "T-KAI | Otaku Streetwear — T-shirts, Hoodies & Accessoires Manga",
  description:
    "Découvre T-KAI : boutique otaku streetwear avec t-shirts, hoodies, casquettes et accessoires personnalisés inspirés manga et anime. Custom Lab disponible.",
  openGraph: {
    title: "T-KAI | Otaku Streetwear — T-shirts, Hoodies & Accessoires Manga",
    description:
      "Boutique otaku streetwear : t-shirts, hoodies, casquettes et accessoires personnalisés inspirés manga et anime.",
    url: "https://tkai-shop.vercel.app",
  },
  alternates: {
    canonical: "https://tkai-shop.vercel.app",
  },
};

export default async function Home() {
  // PRODUITS
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  // CATEGORIES (créées par l'admin via /admin/categories)
  const categories = await prisma.category.findMany({
    where: { featured: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid bg-[length:44px_44px] opacity-20" />
        <div className="absolute inset-0 manga-lines opacity-20" />
        <div className="absolute left-1/2 top-10 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl md:top-20 md:h-[500px] md:w-[500px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:gap-16 md:py-20">
          {/* RIGHT (image en premier sur mobile pour effet visuel) */}
          <div className="relative mx-auto order-1 aspect-square w-44 sm:w-56 md:order-2 md:w-full md:max-w-md">
            <div className="absolute inset-0 rounded-full border border-primary/40 bg-black/60 shadow-glow backdrop-blur-xl" />
            <Image
              src="/logo-tkai.jpeg"
              alt="Logo T-KAI"
              fill
              priority
              sizes="(max-width: 768px) 224px, 448px"
              className="rounded-full object-contain p-6 md:p-10"
            />
          </div>

          {/* LEFT */}
          <div className="order-2 md:order-1">
            <p className="mb-3 inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary md:mb-5 md:px-4 md:py-2 md:text-xs md:tracking-[0.25em]">
              Nouvelle collection · T-KAI
            </p>

            <h1 className="text-3xl font-black uppercase leading-[1.05] sm:text-4xl md:text-8xl">
              Wear Your{" "}
              <span className="text-primary drop-shadow-[0_0_18px_rgba(214,31,31,.65)]">
                Manga
              </span>{" "}
              Energy
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 md:mt-6 md:text-lg">
              T-shirts, hoodies, casquettes et accessoires personnalisés pour
              les vrais fans d&rsquo;anime, manga et streetwear.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 md:mt-8 md:gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-primary px-5 py-3 text-sm font-black text-white shadow-glow transition hover:bg-accent md:px-7 md:py-4 md:text-base"
              >
                Explorer la boutique
              </Link>

              <Link
                href="/custom-lab"
                className="rounded-full border border-primary/50 px-5 py-3 text-sm font-black transition hover:bg-primary/10 md:px-7 md:py-4 md:text-base"
              >
                Personnaliser
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 md:py-16">
          <div className="mb-5 md:mb-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
              Collections
            </p>
            <h2 className="mt-1 text-2xl font-black md:mt-2 md:text-5xl">
              Explore l&rsquo;univers T-KAI
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surface transition duration-300 hover:border-primary hover:shadow-glow"
              >
                {category.imageUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/30 via-black to-black" />
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black uppercase tracking-wide text-white md:text-xl">
                      {category.name}
                    </span>
                    <span className="text-primary transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-[11px] text-zinc-300 md:text-sm">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* TRENDING */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 md:py-16">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
                Trending
              </p>
              <h2 className="mt-1 text-2xl font-black md:mt-2 md:text-5xl">
                Produits iconiques
              </h2>
            </div>
            <Link
              href="/shop"
              className="whitespace-nowrap text-sm font-semibold text-primary transition hover:underline"
            >
              Tout voir →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-10 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.slug} p={product} />
            ))}
          </div>
        </section>
      )}

      {/* CUSTOM LAB */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-black to-black p-5 md:rounded-[2rem] md:p-12">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl md:h-64 md:w-64" />

          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
              Custom Lab
            </p>
            <h2 className="mt-2 text-2xl font-black md:mt-3 md:text-6xl">
              Crée ton outfit unique
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 md:mt-4 md:text-lg">
              Ajoute ton pseudo, ton visuel, ton texte ou ton idée.
              <span className="font-bold text-white">
                {" "}
                T-KAI transforme ton outfit en pièce unique.
              </span>
            </p>
            <Link
              href="/custom-lab"
              className="mt-5 inline-block rounded-full bg-primary px-5 py-3 text-sm font-black text-white shadow-glow transition hover:bg-accent md:mt-8 md:px-7 md:py-4 md:text-base"
            >
              Créer mon design
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}