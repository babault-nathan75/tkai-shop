"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { getCartItemPrice, useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/data";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    now,
    updateQuantity,
    removeItem,
    clear,
    hydrated,
  } = useCart();

  if (!hydrated) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-14 text-white">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-primary">Ta sélection</p>
        <h1 className="display-type mt-3 text-5xl text-foreground md:text-7xl">Ton panier.</h1>
        <p className="mt-6 text-sm text-zinc-500">On prépare tes pièces…</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 text-white md:py-20">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-primary">Ta sélection</p>
        <h1 className="display-type mt-3 text-5xl text-foreground md:text-7xl">Ton panier.</h1>
        <div className="paper-noise mt-10 rounded-[1.5rem] px-6 py-14 text-center text-ink shadow-paper md:rounded-[2rem] md:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingBag size={25} />
          </div>
          <h2 className="display-type mt-5 text-3xl md:text-4xl">Une page encore blanche.</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink/60">
            Les pièces qui te ressemblent t&apos;attendent dans la collection.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 text-[10px] font-black uppercase tracking-[.14em] text-paper transition hover:bg-primary"
          >
            Découvrir la collection <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 text-white md:px-8 md:py-14">
      <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6 md:pb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-primary">
            Ta sélection · {String(totalItems).padStart(2, "0")}
          </p>
          <h1 className="display-type mt-3 text-4xl text-foreground md:text-6xl">
            Prêt à sortir.
          </h1>
        </div>
        <button
          onClick={clear}
          className="min-h-10 rounded-full border border-white/10 px-4 text-[9px] font-black uppercase tracking-[.13em] text-zinc-500 transition hover:border-primary hover:text-white md:text-[10px]"
        >
          Vider
        </button>
      </div>

      <div className="mt-6 grid items-start gap-6 md:mt-9 md:gap-10 lg:grid-cols-[1fr_370px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size || ""}-${item.color || ""}`}
              className="flex flex-col gap-4 rounded-[1.25rem] border border-white/[.08] bg-surface p-3.5 transition hover:border-white/15 sm:flex-row sm:items-center md:gap-5 md:rounded-[1.5rem] md:p-4"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-paper-muted md:h-28 md:w-28">
                <Image
                  src={item.image || "/logo-tkai.jpeg"}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-contain p-2 mix-blend-multiply"
                />
              </div>

              <div className="flex-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-bold text-foreground transition hover:text-accent"
                >
                  {item.name}
                </Link>
                {(item.size || item.color) && (
                  <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                    {[item.size, item.color].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-2 text-sm font-black text-primary">
                  {formatPrice(getCartItemPrice(item, now))}
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-primary hover:text-white"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-primary hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() =>
                  removeItem(item.productId, item.size, item.color)
                }
                aria-label="Retirer l'article"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <aside className="relative h-fit overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface2 p-5 md:sticky md:top-32 md:p-7">
          <div className="absolute left-0 right-0 top-0 h-1 bg-primary" />
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-primary">La suite</p>
          <h2 className="display-type mt-2 text-3xl text-foreground">Récapitulatif</h2>
          <div className="mt-7 flex items-center justify-between text-sm text-zinc-500">
            <span>Sous-total</span>
            <span className="font-bold text-white">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-zinc-500">
            <span>Livraison</span>
            <span className="text-zinc-500">À confirmer</span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="text-[10px] font-black uppercase tracking-[.15em] text-zinc-400">Total</span>
            <span className="text-2xl font-black text-foreground">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-5 text-center text-[10px] font-black uppercase tracking-[.15em] text-white transition hover:bg-accent"
          >
            Passer au checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-white/10 px-5 text-center text-[9px] font-black uppercase tracking-[.14em] text-zinc-400 transition hover:border-white/30 hover:text-white"
          >
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </section>
  );
}
