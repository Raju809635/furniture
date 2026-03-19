"use client";

import * as React from "react";

type WishlistState = {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
};

const WishlistContext = React.createContext<WishlistState | null>(null);
const STORAGE_KEY = "woodnest_wishlist_v1";

function safeParse(json: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as string[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setIds(safeParse(localStorage.getItem(STORAGE_KEY)));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const toggle: WishlistState["toggle"] = (productId) => {
    setIds((prev) => (prev.includes(productId) ? prev.filter((x) => x !== productId) : [...prev, productId]));
  };

  const has: WishlistState["has"] = (productId) => ids.includes(productId);
  const clear = () => setIds([]);

  return (
    <WishlistContext.Provider value={{ ids, toggle, has, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

