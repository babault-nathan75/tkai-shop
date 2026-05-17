"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import { colorToHex, isLightColor } from "@/lib/colors";
import { formatPrice } from "@/lib/data";

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
    <div className="grid gap-6 md:grid-cols-2 md:gap-10">
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-primary/30 bg-red-sun shadow-glow md:rounded-[2rem]">
        <Image
          src={displayedImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover p-6 transition duration-300 md:p-12"
          key={displayedImage}
        />
        {selectedColor && (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider md:left-4 md:top-4 md:px-3 md:text-xs">
            {selectedColor}
          </span>
        )}
      </div>

      {/* INFOS */}
      <div>
        <p className="text-xs font-black uppercase tracking-[.2em] text-primary md:tracking-[.25em]">
          {product.categoryName}
        </p>
        <h1 className="mt-2 text-2xl font-black md:mt-4 md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-2 text-xl font-black text-primary md:mt-4 md:text-2xl md:text-white">
          {formatPrice(product.price)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300 md:mt-6 md:text-base">
          {product.description}
        </p>

        {colorOptions.length > 0 && (
          <div className="mt-5 md:mt-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400 md:mb-3 md:text-sm">
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
                        ? "border-primary scale-110 shadow-glow"
                        : "border-white/20 hover:border-white/50"
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
            <p className="mt-2 text-xs text-zinc-500">
              {selectedColor
                ? `Couleur sélectionnée : ${selectedColor}`
                : "Choisis une couleur"}
            </p>
          </div>
        )}

        {availableSizes.length > 0 && (
          <div className="mt-5 md:mt-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400 md:mb-3 md:text-sm">
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
                        : "border-white/10 hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 md:mt-10 md:gap-4">
          <button
            onClick={handleAdd}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-white shadow-glow transition hover:bg-accent md:flex-initial md:px-7 md:py-4 md:text-base"
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
            {added ? "Ajouté" : "Au panier"}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 rounded-full border border-primary/40 px-5 py-3 text-sm font-black transition hover:bg-primary/10 md:flex-initial md:px-7 md:py-4 md:text-base"
          >
            Acheter
          </button>
        </div>

        <Link
          href="/custom-lab"
          className="mt-6 inline-block text-sm font-bold text-zinc-400 underline-offset-4 transition hover:text-primary hover:underline"
        >
          Tu veux personnaliser ce produit ? Custom Lab →
        </Link>
      </div>
    </div>
  );
}
