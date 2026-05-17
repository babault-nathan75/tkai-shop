"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface SavedOrder {
  orderId: number;
  publicRef: string;
  total: number;
  createdAt: string; // ISO
  itemsSummary: string; // ex: "Shadow Ronin Tee x1, Akai Hoodie x2"
}

interface ClientOrdersContextValue {
  orders: SavedOrder[];
  saveOrder: (order: SavedOrder) => void;
  removeOrder: (orderId: number) => void;
  clear: () => void;
  hydrated: boolean;
}

const STORAGE_KEY = "tkai_client_orders_v1";
const MAX_ORDERS = 30;

const ClientOrdersContext = createContext<ClientOrdersContextValue | null>(
  null
);

export function ClientOrdersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedOrder[];
        if (Array.isArray(parsed)) {
          setOrders(
            parsed.filter(
              (o) =>
                typeof o.orderId === "number" &&
                typeof o.publicRef === "string"
            )
          );
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders, hydrated]);

  const saveOrder = useCallback((order: SavedOrder) => {
    setOrders((prev) => {
      // Évite les doublons (même orderId)
      const without = prev.filter((o) => o.orderId !== order.orderId);
      const next = [order, ...without].slice(0, MAX_ORDERS);
      return next;
    });
  }, []);

  const removeOrder = useCallback((orderId: number) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
  }, []);

  const clear = useCallback(() => setOrders([]), []);

  const value = useMemo<ClientOrdersContextValue>(
    () => ({ orders, saveOrder, removeOrder, clear, hydrated }),
    [orders, saveOrder, removeOrder, clear, hydrated]
  );

  return (
    <ClientOrdersContext.Provider value={value}>
      {children}
    </ClientOrdersContext.Provider>
  );
}

export function useClientOrders() {
  const ctx = useContext(ClientOrdersContext);
  if (!ctx) {
    throw new Error(
      "useClientOrders doit être utilisé dans un ClientOrdersProvider"
    );
  }
  return ctx;
}
