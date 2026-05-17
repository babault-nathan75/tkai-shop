"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { useCart } from "./CartContext";
import { useClientOrders } from "./ClientOrdersContext";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match: (path: string) => boolean;
  badge?: number;
};

export function BottomNav() {
  const pathname = usePathname() || "/";
  const { totalItems, hydrated: cartHydrated } = useCart();
  const { orders, hydrated: ordersHydrated } = useClientOrders();

  // Masque la nav sur l'admin
  if (pathname.startsWith("/admin")) return null;

  const cartCount = cartHydrated ? totalItems : 0;
  const ordersCount = ordersHydrated ? orders.length : 0;

  const items: NavItem[] = [
    {
      href: "/",
      label: "Accueil",
      icon: Home,
      match: (p) => p === "/",
    },
    {
      href: "/shop",
      label: "Shop",
      icon: Store,
      match: (p) => p === "/shop" || p.startsWith("/product"),
    },
    {
      href: "/custom-lab",
      label: "Custom",
      icon: Sparkles,
      match: (p) => p.startsWith("/custom-lab"),
    },
    {
      href: "/track",
      label: "Commandes",
      icon: Package,
      match: (p) => p.startsWith("/track"),
      badge: ordersCount,
    },
    {
      href: "/cart",
      label: "Panier",
      icon: ShoppingBag,
      match: (p) => p === "/cart" || p === "/checkout",
      badge: cartCount,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navigation principale"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-1 px-2 py-2.5 text-[10px] font-bold uppercase tracking-wider transition ${
                  active ? "text-primary" : "text-zinc-400 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 2}
                    className={active ? "drop-shadow-[0_0_8px_rgba(214,31,31,0.6)]" : ""}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white"
                      aria-label={`${item.badge}`}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary shadow-glow" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
