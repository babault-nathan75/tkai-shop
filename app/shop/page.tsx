// app/shop/page.tsx

import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category;

  if (category) {
    const cat = await prisma.category.findUnique({
      where: { slug: category },
      select: { name: true, description: true },
    });

    const catName = cat?.name ?? category;
    return {
      title: `${catName} — Boutique T-KAI`,
      description:
        cat?.description ??
        `Découvre les produits de la catégorie ${catName} sur T-KAI Shop.`,
      openGraph: {
        title: `${catName} | T-KAI Shop`,
        description:
          cat?.description ??
          `Produits ${catName} — boutique otaku streetwear T-KAI.`,
        url: `https://tkai-shop.vercel.app/shop?category=${category}`,
      },
      alternates: {
        canonical: `https://tkai-shop.vercel.app/shop?category=${category}`,
      },
    };
  }

  return {
    title: "Catalogue — Boutique Otaku Streetwear T-KAI",
    description:
      "Explore le catalogue T-KAI : t-shirts, hoodies, casquettes et accessoires otaku streetwear. Filtrage par catégorie disponible.",
    openGraph: {
      title: "Catalogue | T-KAI Shop",
      description:
        "Explore le catalogue T-KAI : t-shirts, hoodies, casquettes et accessoires otaku streetwear.",
      url: "https://tkai-shop.vercel.app/shop",
    },
    alternates: {
      canonical: "https://tkai-shop.vercel.app/shop",
    },
  };
}

export default async function Shop({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  const selectedCategory = params.category;

  // CATEGORIES
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // PRODUITS
  const products = await prisma.product.findMany({
    where: selectedCategory
      ? {
          category: {
            slug: selectedCategory,
          },
        }
      : undefined,

    include: {
      category: true,
      images: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 md:px-8 md:pb-24 md:pt-14">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface2 px-5 py-9 md:rounded-[2rem] md:px-12 md:py-14">
          <div className="absolute -right-10 -top-32 h-72 w-72 rounded-full bg-primary/15 blur-[85px]" />
          <div className="relative grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.22em] text-primary">
                <span className="h-px w-6 bg-primary" />
                La collection T-KAI
              </p>
              <h1 className="display-type text-balance mt-4 text-5xl leading-[.92] text-foreground md:mt-6 md:text-8xl">
                Ton univers.
                <br />
                <span className="italic text-primary">Ton uniforme.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 md:mt-6 md:text-base">
                Des pièces pensées pour la rue, inspirées par les univers qui
                nous rassemblent.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.16em] text-zinc-500 md:pb-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-primary">
                <ArrowDown size={15} />
              </span>
              {products.length} pièce{products.length > 1 ? "s" : ""} à découvrir
            </div>
          </div>
        </div>

        <div className="mt-9 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-zinc-500 md:mt-14">
          <SlidersHorizontal size={14} className="text-primary" />
          Affiner par univers
        </div>
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:pb-0">
          <Link
            href="/shop"
            className={`flex-shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition md:px-5 md:py-3 md:text-sm ${
              !selectedCategory
                ? "border-primary bg-primary text-white"
                : "border-white/10 bg-white/[.025] text-zinc-400 hover:border-white/30 hover:text-white"
            }`}
          >
            Tous
          </Link>

          {categories.map((category) => {
            const isActive = selectedCategory === category.slug;
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={`flex-shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition md:px-5 md:py-3 md:text-sm ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-white/10 bg-white/[.025] text-zinc-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        {/* PRODUCTS */}
        <div className="mt-7 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              p={{
                ...product,

                image:
                  product.images?.[0]?.url ||
                  "/placeholder.jpg",
              }}
            />
          ))}
        </div>

        {/* EMPTY */}
        {products.length === 0 && (
          <div className="mt-12 rounded-[1.5rem] border border-white/10 bg-surface px-6 py-16 text-center md:py-24">
            <h2 className="display-type text-4xl text-foreground md:text-5xl">
              Rien ici, pour l&apos;instant.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
              Cette collection se prépare. Explore les autres univers T-KAI en
              attendant.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex min-h-11 items-center rounded-full bg-paper px-5 text-[10px] font-black uppercase tracking-[.14em] text-ink transition hover:bg-primary hover:text-white"
            >
              Voir toutes les pièces
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}