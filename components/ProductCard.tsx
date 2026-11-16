import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PromoPrice } from "@/components/PromoPrice";
import { getActiveSalePrice } from "@/lib/promotions";

interface ProductCardProps {
  p: {
    id?: number;
    slug: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number | null;
    saleEndsAt?: Date | string | null;
    image?: string;
    images?: { url: string }[];
    badge?: string;
    category?:
      | string
      | {
          name: string;
          slug?: string;
        };
  };
}

export function ProductCard({ p }: ProductCardProps) {
  const image = p.image || p.images?.[0]?.url || "/placeholder.jpg";
  const isOnSale =
    getActiveSalePrice(p.price, p.salePrice, p.saleEndsAt) !== null;
  const categoryName =
    typeof p.category === "string"
      ? p.category
      : p.category?.name || "Collection";

  return (
    <Link
      href={`/product/${p.slug}`}
      className="group relative block overflow-hidden rounded-[1.25rem] border border-white/[.08] bg-surface transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_rgba(0,0,0,.3)] md:rounded-[1.6rem]"
    >
      <div className="relative aspect-[4/4.7] overflow-hidden bg-paper-muted">
        <Image
          src={image}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 50vw, (min-width: 1280px) 25vw, 33vw"
          className="object-contain p-5 mix-blend-multiply transition duration-700 ease-out group-hover:scale-[1.06] md:p-8"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2 md:left-4 md:top-4">
          {isOnSale && (
            <span className="rounded-full bg-primary px-3 py-1.5 text-[9px] font-black uppercase tracking-[.13em] text-white shadow-lg md:px-3.5 md:text-[10px]">
              Promo
            </span>
          )}
          {p.badge && (
            <span className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-paper/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.12em] text-ink backdrop-blur md:text-[10px]">
              <Sparkles size={11} className="text-primary" />
              {p.badge}
            </span>
          )}
        </div>

        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-paper text-ink opacity-0 shadow-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-4 md:right-4 md:h-11 md:w-11">
          <ArrowUpRight size={17} />
        </span>
        <span className="absolute bottom-3 left-3 rounded-full border border-white/35 bg-ink/60 px-3 py-1 text-[9px] font-bold uppercase tracking-[.15em] text-white backdrop-blur-md md:bottom-4 md:left-4">
          {categoryName}
        </span>
      </div>

      <div className="p-3.5 md:p-5">
        <div className="flex min-h-[3.2rem] items-start justify-between gap-3 md:min-h-[3.7rem]">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition group-hover:text-accent md:text-lg">
            {p.name}
          </h3>
          <ArrowUpRight
            size={15}
            className="mt-0.5 shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>
        <p className="mt-1 line-clamp-1 text-[11px] text-zinc-500 md:mt-1.5 md:text-xs">
          {p.description}
        </p>
        <div className="mt-3 border-t border-white/[.08] pt-3 md:mt-4 md:pt-4">
          <PromoPrice
            price={p.price}
            salePrice={p.salePrice}
            saleEndsAt={p.saleEndsAt}
            initialNow={Date.now()}
          />
        </div>
      </div>
    </Link>
  );
}
