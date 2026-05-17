// app/shop/page.tsx

import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
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
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-14">
        {/* HEADER */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.3em]">
            Shop
          </p>
          <h1 className="mt-2 text-3xl font-black md:mt-3 md:text-7xl">
            Catalogue T-KAI
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400 md:mt-4 md:text-base">
            Explore les dernières collections manga streetwear,
            hoodies, casquettes et accessoires personnalisés T-KAI.
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-10 md:flex-wrap md:gap-3 md:overflow-visible md:pb-0">
          <Link
            href="/shop"
            className={`flex-shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition md:px-5 md:py-3 md:text-sm ${
              !selectedCategory
                ? "border-primary bg-primary text-white"
                : "border-white/10 bg-surface hover:border-primary"
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
                    : "border-white/10 bg-surface hover:border-primary"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        {/* PRODUCTS */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:mt-12 md:gap-6 lg:grid-cols-3">
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
          <div className="mt-20 rounded-[2rem] border border-white/10 bg-surface p-12 text-center">
            <h2 className="text-3xl font-black">
              Aucun produit trouvé
            </h2>

            <p className="mt-4 text-zinc-400">
              Aucun produit n’est disponible dans cette
              catégorie pour le moment.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}