"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/cart/cart-context";
import { WishlistProvider } from "@/components/wishlist/wishlist-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <Toaster richColors position="top-right" />
        </CartProvider>
      </WishlistProvider>
    </SessionProvider>
  );
}

