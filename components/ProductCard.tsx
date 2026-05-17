// components/ProductCard.tsx

import Image from "next/image";
import Link from "next/link";

import { ShoppingBag, Sparkles } from "lucide-react";

interface ProductCardProps {
  p: {
    id?: number;
    slug: string;
    name: string;
    description: string;
    price: number;

    image?: string;

    images?: {
      url: string;
    }[];

    badge?: string;

    category?:
      | string
      | {
          name: string;
          slug?: string;
        };
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

export function ProductCard({
  p,
}: ProductCardProps) {
  const image =
    p.image ||
    p.images?.[0]?.url ||
    "/placeholder.jpg";

  const categoryName =
    typeof p.category === "string"
      ? p.category
      : p.category?.name || "Collection";

  return (
    <Link
      href={`/product/${p.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface transition duration-300 hover:border-primary/60 hover:shadow-glow md:rounded-[2rem] md:hover:-translate-y-2"
    >
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />

      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-black via-[#111] to-[#1A1A1A]">
        <Image
          src={image}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover p-4 transition duration-500 group-hover:scale-110 md:p-8"
        />

        {p.badge && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-glow md:left-4 md:top-4 md:gap-2 md:px-4 md:py-2 md:text-xs">
            <Sparkles size={10} className="md:h-3 md:w-3" />
            {p.badge}
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 p-3 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[10px] font-black uppercase tracking-wider text-primary md:text-xs md:tracking-[0.25em]">
            {categoryName}
          </p>

          <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 transition group-hover:border-primary group-hover:bg-primary/10 md:flex">
            <ShoppingBag size={18} className="transition group-hover:scale-110" />
          </div>
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm font-black leading-tight text-white transition group-hover:text-primary md:mt-4 md:text-2xl">
          {p.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-400 md:mt-3 md:text-sm">
          {p.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 md:mt-6">
          <p className="text-base font-black text-white md:text-2xl">
            {formatPrice(p.price)}
          </p>

          <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-primary transition group-hover:bg-primary group-hover:text-white md:inline-flex">
            Voir
          </span>
        </div>
      </div>
    </Link>
  );
}