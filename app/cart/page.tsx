"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/data";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clear,
    hydrated,
  } = useCart();

  if (!hydrated) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-14 text-white">
        <h1 className="text-5xl font-black">Panier</h1>
        <p className="mt-6 text-zinc-400">Chargement du panier...</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-14 text-white">
        <h1 className="text-5xl font-black">Panier</h1>
        <div className="mt-10 rounded-3xl border border-white/10 bg-surface p-12 text-center">
          <ShoppingBag size={48} className="mx-auto text-primary" />
          <h2 className="mt-6 text-3xl font-black">Ton panier est vide</h2>
          <p className="mt-3 text-zinc-400">
            Explore la boutique et ajoute des produits à ton panier.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-primary px-7 py-4 font-black text-white shadow-glow transition hover:scale-105 hover:bg-accent"
          >
            Aller à la boutique
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 text-white md:py-14">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary md:tracking-[0.25em]">
            Panier
          </p>
          <h1 className="mt-1 text-3xl font-black md:mt-2 md:text-5xl">
            {totalItems} article{totalItems > 1 ? "s" : ""}
          </h1>
        </div>
        <button
          onClick={clear}
          className="text-xs font-bold text-zinc-400 transition hover:text-red-400 md:text-sm"
        >
          Vider
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:mt-10 md:gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size || ""}-${item.color || ""}`}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-black/40">
                <Image
                  src={item.image || "/logo-tkai.jpeg"}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover p-2"
                />
              </div>

              <div className="flex-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-black hover:text-primary"
                >
                  {item.name}
                </Link>
                {(item.size || item.color) && (
                  <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                    {[item.size, item.color].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-2 text-primary font-black">
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity - 1,
                      item.size,
                      item.color
                    )
                  }
                  aria-label="Diminuer la quantité"
                  className="rounded-full border border-white/10 p-2 hover:border-primary"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-6 text-center font-black">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity + 1,
                      item.size,
                      item.color
                    )
                  }
                  aria-label="Augmenter la quantité"
                  className="rounded-full border border-white/10 p-2 hover:border-primary"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() =>
                  removeItem(item.productId, item.size, item.color)
                }
                aria-label="Retirer l'article"
                className="rounded-full border border-red-500/40 p-2 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-surface p-6">
          <h2 className="text-xl font-black uppercase">Récapitulatif</h2>
          <div className="mt-6 flex items-center justify-between text-zinc-400">
            <span>Sous-total</span>
            <span className="font-bold text-white">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-zinc-400">
            <span>Livraison</span>
            <span className="text-zinc-500">À confirmer</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-black uppercase">Total</span>
            <span className="text-2xl font-black text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-primary px-7 py-4 text-center font-black text-white shadow-glow transition hover:bg-accent"
          >
            Passer au checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 block w-full rounded-full border border-white/10 px-7 py-3 text-center text-sm font-bold transition hover:border-primary"
          >
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </section>
  );
}
