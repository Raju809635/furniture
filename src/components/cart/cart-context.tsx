"use client";

import * as React from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
  currency: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalCents: number;
  totalItems: number;
};

const CartContext = React.createContext<CartState | null>(null);
const STORAGE_KEY = "woodnest_cart_v1";

function safeParse(json: string | null): CartItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  React.useEffect(() => {
    setItems(safeParse(localStorage.getItem(STORAGE_KEY)));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartState["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem: CartState["removeItem"] = (productId) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  const setQty: CartState["setQty"] = (productId, qty) => {
    setItems((prev) =>
      prev
        .map((p) => (p.productId === productId ? { ...p, qty } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const clear = () => setItems([]);

  const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const value: CartState = {
    items,
    addItem,
    removeItem,
    setQty,
    clear,
    totalCents,
    totalItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

