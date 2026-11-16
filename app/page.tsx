import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight, MoveRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

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
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, images: { orderBy: { position: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { featured: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const heroProduct = products[0];
  const heroImage =
    heroProduct?.images[0]?.url ?? "/logo-tkai.jpeg";

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto max-w-[1600px] px-4 pb-8 pt-5 md:px-8 md:pb-12 md:pt-8">
        <div className="paper-noise relative isolate min-h-[620px] overflow-hidden rounded-[1.75rem] text-ink shadow-paper md:min-h-[690px] md:rounded-[2.5rem]">
          <div className="absolute right-0 top-0 z-0 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute left-[49%] top-12 z-0 hidden h-[85%] w-px bg-ink/10 lg:block" />

          <div className="relative z-10 grid min-h-[620px] items-center gap-8 px-6 py-10 md:px-12 md:py-14 lg:min-h-[690px] lg:grid-cols-[1fr_1.04fr] lg:gap-0 lg:px-20">
            <div className="relative z-10 max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.23em] text-primary md:text-xs">
                <span className="h-px w-7 bg-primary" />
                T-KAI · Abidjan, Côte d&apos;Ivoire
              </p>

              <h1 className="display-type text-balance mt-6 text-[clamp(3rem,7vw,6.3rem)] leading-[.87]">
                La culture
                <br />
                manga passe
                <br />
                <span className="relative inline-block italic text-primary">
                  en mode rue.
                  <span className="absolute -bottom-1 left-0 h-[3px] w-[86%] -rotate-2 bg-primary/70 md:-bottom-2 md:h-1" />
                </span>
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-ink/65 md:mt-9 md:text-base">
                Des pièces faites pour les fans qui portent leurs univers
                préférés bien au-delà de l&apos;écran.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                <Link
                  href="/shop"
                  className="group inline-flex min-h-12 items-center gap-5 rounded-full bg-ink px-6 text-[11px] font-black uppercase tracking-[.14em] text-paper transition hover:bg-primary"
                >
                  Découvrir la collection
                  <MoveRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/custom-lab"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/15 px-5 text-[11px] font-black uppercase tracking-[.12em] text-ink transition hover:border-primary hover:text-primary"
                >
                  Custom Lab <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-3 border-t border-ink/10 pt-5 md:mt-16">
                <span className="h-px w-8 bg-primary" />
                <p className="text-[10px] font-bold uppercase tracking-[.13em] text-ink/55">
                  Design indépendant · Abidjan
                </p>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[610px] items-center justify-center lg:ml-auto lg:h-full lg:max-w-none">
              <div className="absolute right-[7%] top-[3%] z-10 flex h-20 w-20 rotate-12 flex-col items-center justify-center rounded-full bg-primary text-center text-[8px] font-black uppercase leading-[1.15] tracking-[.12em] text-white shadow-xl md:right-[6%] md:top-[8%] md:h-28 md:w-28 md:text-[10px]">
                Manga
                <br />
                made
                <br />
                wearable
              </div>
              <div className="relative aspect-[1.06] w-full max-w-[530px] overflow-hidden rounded-[1.3rem] bg-paper-muted md:rounded-[2rem]">
                <Image
                  src={heroImage}
                  alt={heroProduct?.name ?? "Sélection T-KAI"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-contain p-7 mix-blend-multiply transition duration-700 hover:scale-[1.035] md:p-12"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white md:bottom-8 md:left-8 md:right-8">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[.22em] text-white/65">
                      La pièce du moment
                    </p>
                    <p className="mt-1 text-lg font-black md:text-2xl">
                      {heroProduct?.name ?? "L'univers T-KAI"}
                    </p>
                  </div>
                  <Link
                    href={heroProduct ? `/product/${heroProduct.slug}` : "/shop"}
                    aria-label="Découvrir la pièce du moment"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition hover:bg-primary hover:text-white md:h-14 md:w-14"
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-2 hidden rotate-[-8deg] border border-primary/50 bg-paper px-4 py-2 text-[9px] font-black uppercase tracking-[.2em] text-primary shadow-xl sm:block md:left-0 md:px-5 md:py-3">
                Pas juste un vêtement. Ton univers.
              </div>
            </div>
          </div>

          <span className="absolute bottom-7 right-9 hidden text-[9px] font-bold uppercase tracking-[.2em] text-ink/35 xl:block">
            05° 20&apos; N · 04° 01&apos; W
          </span>
        </div>
      </section>

      <div className="border-y border-white/10 bg-[#10110f]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 text-center text-[9px] font-black uppercase tracking-[.2em] text-zinc-500 sm:gap-x-10 md:py-5 md:text-[10px]">
          <span className="text-foreground">Otaku energy</span>
          <span className="text-primary">✳</span>
          <span>Streetwear sans frontières</span>
          <span className="hidden text-primary sm:inline">✳</span>
          <span className="hidden sm:inline">Créé pour les vrais fans</span>
          <span className="hidden text-primary md:inline">✳</span>
          <span className="hidden md:inline">Livraison partout en CI</span>
        </div>
      </div>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-primary">
                Trouve ton univers
              </p>
              <h2 className="display-type mt-3 text-4xl text-foreground md:text-6xl">
                Nos <span className="italic text-primary">collections.</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[.15em] text-zinc-400 transition hover:text-white sm:inline-flex"
            >
              Tout explorer <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {categories.slice(0, 4).map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={`group relative isolate aspect-[.88] overflow-hidden rounded-2xl border border-white/10 bg-surface md:rounded-[1.5rem] ${
                  index === 0 ? "md:col-span-2 md:row-span-2 md:aspect-auto" : ""
                }`}
              >
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 35vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(228,67,50,.28),transparent_40%),linear-gradient(135deg,#24231f,#10110f_70%)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/5" />
                <div className="absolute left-4 top-4 text-[9px] font-black uppercase tracking-[.2em] text-white/65 md:left-6 md:top-6">
                  Collection · 0{index + 1}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 md:bottom-6 md:left-6 md:right-6">
                  <div>
                    <h3 className="text-lg font-black text-white md:text-2xl">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="mt-1 hidden max-w-sm text-xs text-white/65 md:block">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition group-hover:border-primary group-hover:bg-primary">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="bg-surface py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.22em] text-primary">
                  Sélection T-KAI
                </p>
                <h2 className="display-type mt-3 text-4xl text-foreground md:text-6xl">
                  Pièces <span className="italic text-primary">iconiques.</span>
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 pb-1 text-[10px] font-black uppercase tracking-[.15em] text-zinc-400 transition hover:text-white"
              >
                Tout voir
                <MoveRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-3 md:gap-5">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.slug} p={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface2 px-6 py-10 md:rounded-[2.5rem] md:px-14 md:py-16">
          <div className="absolute -right-12 -top-20 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-[90px]" />
          <div className="absolute bottom-0 right-[15%] -z-10 h-48 w-48 rounded-full border border-white/[.06]" />
          <div className="grid items-end gap-8 md:grid-cols-[1fr_auto] md:gap-12">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.22em] text-primary">
                <Sparkles size={14} />
                Custom Lab · pièce unique
              </p>
              <h2 className="display-type text-balance mt-4 max-w-3xl text-4xl leading-[.98] text-foreground md:text-7xl">
                Ton idée mérite
                <br className="hidden sm:block" /> d&apos;être{" "}
                <span className="italic text-primary">portée.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
                Texte, couleurs, visuels : compose ton design et donne vie à
                une pièce qui n&apos;appartient qu&apos;à toi.
              </p>
            </div>
            <Link
              href="/custom-lab"
              className="group inline-flex min-h-12 items-center justify-between gap-8 rounded-full bg-paper px-6 text-[10px] font-black uppercase tracking-[.14em] text-ink transition hover:bg-primary hover:text-white"
            >
              Lancer le studio
              <ArrowDownRight
                size={17}
                className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
