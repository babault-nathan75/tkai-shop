"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import { useClientOrders } from "./ClientOrdersContext";

export function Navbar() {
  const { totalItems, hydrated: cartHydrated } = useCart();
  const { orders, hydrated: ordersHydrated } = useClientOrders();
  const cartCount = cartHydrated ? totalItems : 0;
  const ordersCount = ordersHydrated ? orders.length : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80 md:gap-3"
        >
          <Image
            src="/logo-tkai.jpeg"
            alt="T-KAI Logo"
            width={36}
            height={36}
            className="rounded-full border border-primary/60 md:h-[46px] md:w-[46px]"
          />
          <span className="text-base font-black tracking-widest text-red-600 md:text-xl">
            T-KAI
          </span>
        </Link>

        {/* Liens : desktop uniquement (bottom nav prend le relais sur mobile) */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-300 md:flex">
          <Link href="/shop" className="transition-colors hover:text-primary">
            Shop
          </Link>
          <Link
            href="/custom-lab"
            className="transition-colors hover:text-primary"
          >
            Personalisation
          </Link>
          <Link
            href="/track"
            className="transition-colors hover:text-primary"
          >
            Mes commandes
          </Link>
          <Link
            href="/checkout"
            className="transition-colors hover:text-primary"
          >
            Checkout
          </Link>
        </nav>

        {/* Actions à droite : desktop only (mobile = bottom nav) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/track"
            aria-label="Mes commandes"
            className="relative rounded-full border border-white/10 p-3 text-zinc-300 transition-all hover:border-primary hover:text-primary"
          >
            <Package size={18} />
            {ordersCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-black text-white">
                {ordersCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label="Voir le panier"
            className="relative rounded-full border border-primary/40 p-3 text-primary transition-all hover:bg-primary hover:text-white"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile : juste un cart accessible en haut à droite */}
        <Link
          href="/cart"
          aria-label="Panier"
          className="relative rounded-full border border-primary/40 p-2 text-primary md:hidden"
        >
          <ShoppingBag size={16} />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
