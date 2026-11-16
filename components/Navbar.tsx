"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import { useClientOrders } from "./ClientOrdersContext";

export function Navbar() {
  const pathname = usePathname() || "/";
  const { totalItems, hydrated: cartHydrated } = useCart();
  const { orders, hydrated: ordersHydrated } = useClientOrders();
  const cartCount = cartHydrated ? totalItems : 0;
  const ordersCount = ordersHydrated ? orders.length : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/90 backdrop-blur-2xl">
      <div className="border-b border-white/[.06] bg-background">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[9px] font-bold uppercase tracking-[.2em] text-zinc-400 md:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          L&apos;uniforme de ceux qui vivent la culture manga
          <span className="hidden text-zinc-600 sm:inline">·</span>
          <span className="hidden text-primary sm:inline">Abidjan / partout</span>
        </p>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80 md:gap-3"
        >
          <Image
            src="/logo-tkai.jpeg"
            alt="T-KAI Logo"
            width={42}
            height={42}
            className="rounded-full border border-white/15 transition duration-500 group-hover:rotate-[-8deg] md:h-12 md:w-12"
          />
          <span className="text-base font-black tracking-[.24em] text-foreground md:text-lg">
            T-KAI
          </span>
          <span className="hidden border-l border-white/15 pl-3 text-[9px] font-semibold uppercase leading-tight tracking-[.16em] text-zinc-500 lg:block">
            Manga<br />streetwear
          </span>
        </Link>

        {/* Liens : desktop uniquement (bottom nav prend le relais sur mobile) */}
        <nav className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[.14em] text-zinc-400 md:flex">
          <Link href="/shop" className={`transition-colors hover:text-white ${pathname === "/shop" ? "text-white" : ""}`}>
            La collection
          </Link>
          <Link
            href="/custom-lab"
            className={`transition-colors hover:text-white ${pathname.startsWith("/custom-lab") ? "text-white" : ""}`}
          >
            Personnalisation
          </Link>
          <Link
            href="/track"
            className={`transition-colors hover:text-white ${pathname.startsWith("/track") ? "text-white" : ""}`}
          >
            Mes commandes
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-primary transition-colors hover:text-accent"
          >
            Explorer <span aria-hidden="true">↗</span>
          </Link>
        </nav>

        {/* Actions à droite : desktop only (mobile = bottom nav) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/track"
            aria-label="Mes commandes"
            className="relative rounded-full border border-white/10 p-3 text-zinc-300 transition-all hover:border-white/30 hover:text-white"
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
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary text-white transition-all hover:bg-accent"
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
          className="relative rounded-full border border-white/15 p-2.5 text-foreground transition hover:border-primary md:hidden"
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
