"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getActiveSalePrice } from "@/lib/promotions";

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  // price is the regular price; active promotions are applied from their deadline.
  price: number;
  promoPrice?: number | null;
  promoEndsAt?: string | null;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  now: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number, size?: string, color?: string) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clear: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "tkai_cart_v1";

function lineKey(item: { productId: number; size?: string; color?: string }) {
  return `${item.productId}::${item.size || ""}::${item.color || ""}`;
}

export function getCartItemPrice(item: CartItem, now = Date.now()) {
  return (
    getActiveSalePrice(item.price, item.promoPrice, item.promoEndsAt, now) ??
    item.price
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setNow(Date.now());

    if (!items.some((item) => item.promoPrice && item.promoEndsAt)) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (incoming: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = lineKey(incoming);
        const existing = prev.find((it) => lineKey(it) === key);
        if (existing) {
          return prev.map((it) =>
            lineKey(it) === key
              ? { ...it, ...incoming, quantity: it.quantity + quantity }
              : it
          );
        }
        return [...prev, { ...incoming, quantity }];
      });
    },
    []
  );

  const removeItem = useCallback(
    (productId: number, size?: string, color?: string) => {
      const key = lineKey({ productId, size, color });
      setItems((prev) => prev.filter((it) => lineKey(it) !== key));
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number, size?: string, color?: string) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      const key = lineKey({ productId, size, color });
      setItems((prev) =>
        prev.map((it) => (lineKey(it) === key ? { ...it, quantity } : it))
      );
    },
    [removeItem]
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((s, it) => s + it.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * getCartItemPrice(item, now),
      0
    );
    return {
      items,
      totalItems,
      totalPrice,
      now,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      hydrated,
    };
  }, [items, addItem, removeItem, updateQuantity, clear, hydrated, now]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return ctx;
}
