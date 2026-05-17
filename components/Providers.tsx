"use client";

import { CartProvider } from "./CartContext";
import { ClientOrdersProvider } from "./ClientOrdersContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ClientOrdersProvider>{children}</ClientOrdersProvider>
    </CartProvider>
  );
}
