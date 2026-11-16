"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "./CartContext";
import { colorToHex, isLightColor } from "@/lib/colors";
import { PromoPrice } from "@/components/PromoPrice";

export interface ProductDetailImage {
  url: string;
  color: string | null;
}

interface ProductDetailClientProps {
  product: {
    id: number;
    slug: string;
    name: string;
    price: number;
    salePrice: number | null;
    saleEndsAt: string | null;
    promoReferenceTime: number;
    description: string;
    categoryName: string;
  };
  images: ProductDetailImage[];
  fallbackImage: string;
  availableSizes: string[];
}

export function ProductDetailClient({
  product,
  images,
  fallbackImage,
  availableSizes,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();

  // Couleurs uniques tirées des images attachées
  const colorOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const img of images) {
      const c = (img.color || "").trim();
      if (c && !seen.has(c.toLowerCase())) {
        seen.add(c.toLowerCase());
        list.push(c);
      }
    }
    return list;
  }, [images]);

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colorOptions[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    availableSizes[0]
  );
  const [added, setAdded] = useState(false);

  const displayedImage = useMemo(() => {
    if (selectedColor) {
      const match = images.find(
        (img) =>
          (img.color || "").trim().toLowerCase() ===
          selectedColor.toLowerCase()
      );
      if (match) return match.url;
    }
    return images[0]?.url || fallbackImage;
  }, [images, selectedColor, fallbackImage]);

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        promoPrice: product.salePrice,
        promoEndsAt: product.saleEndsAt,
        image: displayedImage,
        size: selectedSize,
        color: selectedColor,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/checkout");
  }

  return (
    <div className="grid items-start gap-8 md:grid-cols-[1.05fr_.95fr] md:gap-12 lg:gap-20">
      <div className="relative aspect-[.92] overflow-hidden rounded-[1.5rem] bg-paper-muted md:sticky md:top-32 md:rounded-[2rem]">
        <Image
          src={displayedImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-8 mix-blend-multiply transition duration-500 md:p-16"
          key={displayedImage}
        />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-ink/10 bg-paper/90 px-3 py-2 text-[9px] font-black uppercase tracking-[.16em] text-ink backdrop-blur md:left-6 md:top-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          T-KAI · Édition originale
        </div>
        {selectedColor && (
          <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-ink/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-white backdrop-blur-md md:bottom-6 md:left-6">
            {selectedColor}
          </span>
        )}
        <span className="absolute bottom-4 right-4 text-[9px] font-black uppercase tracking-[.18em] text-ink/50 md:bottom-6 md:right-6">
          {String(product.id).padStart(3, "0")} / TK
        </span>
      </div>

      <div className="pt-1 md:pt-4">
        <p className="text-[10px] font-black uppercase tracking-[.22em] text-primary">
          Collection / {product.categoryName}
        </p>
        <h1 className="display-type text-balance mt-4 text-4xl leading-[.98] text-foreground md:mt-5 md:text-6xl lg:text-7xl">
          {product.name}
        </h1>
        <div className="mt-5 border-b border-white/10 pb-6 md:mt-7 md:pb-8">
          <PromoPrice
            price={product.price}
            salePrice={product.salePrice}
            saleEndsAt={product.saleEndsAt}
            initialNow={product.promoReferenceTime}
            size="detail"
          />
        </div>
        <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 md:mt-7 md:text-base md:leading-8">
          {product.description}
        </p>

        {colorOptions.length > 0 && (
          <div className="mt-6 md:mt-8">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[.16em] text-zinc-400 md:mb-4">
              Couleur
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {colorOptions.map((c) => {
                const isSelected =
                  selectedColor?.toLowerCase() === c.toLowerCase();
                const hex = colorToHex(c);
                const light = isLightColor(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    aria-pressed={isSelected}
                    aria-label={`Couleur ${c}`}
                    title={c}
                    className={`relative h-10 w-10 rounded-full border-2 transition md:h-12 md:w-12 ${
                      isSelected
                        ? "scale-110 border-white shadow-[0_0_0_3px_rgb(228_67_50)]"
                        : "border-white/20 hover:border-white/60"
                    }`}
                    style={{ background: hex }}
                  >
                    {isSelected && (
                      <Check
                        size={18}
                        className="absolute inset-0 m-auto"
                        color={light ? "#000" : "#fff"}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[.12em] text-zinc-500">
              {selectedColor
                ? `Couleur sélectionnée : ${selectedColor}`
                : "Choisis une couleur"}
            </p>
          </div>
        )}

        {availableSizes.length > 0 && (
          <div className="mt-6 md:mt-8">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[.16em] text-zinc-400 md:mb-4">
              Taille
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {availableSizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    aria-pressed={isSelected}
                    className={`min-w-12 rounded-xl border px-3 py-2 text-sm font-bold transition md:px-4 md:py-3 md:text-base ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-white/10 bg-white/[.025] text-zinc-300 hover:border-white/30"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10">
          <button
            onClick={handleAdd}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-4 text-[10px] font-black uppercase tracking-[.1em] text-white transition hover:bg-accent md:min-h-14 md:text-xs"
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
            {added ? "Ajouté" : "Au panier"}
          </button>
          <button
            onClick={handleBuyNow}
            className="min-h-12 rounded-full border border-white/20 px-4 text-[10px] font-black uppercase tracking-[.1em] transition hover:border-white/50 hover:bg-white/[.04] md:min-h-14 md:text-xs"
          >
            Acheter
          </button>
        </div>

        <Link
          href="/custom-lab"
          className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.13em] text-zinc-500 underline-offset-4 transition hover:text-white hover:underline"
        >
          Tu veux personnaliser ? Découvrir le Custom Lab →
        </Link>

        <div className="mt-8 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-relaxed tracking-[.08em] text-zinc-500">
            <Truck size={17} className="shrink-0 text-primary" />
            Livraison partout en Côte d&apos;Ivoire
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-relaxed tracking-[.08em] text-zinc-500">
            <PackageCheck size={17} className="shrink-0 text-primary" />
            Commande confirmée par notre équipe
          </div>
        </div>
      </div>
    </div>
  );
}
