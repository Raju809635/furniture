"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  currency: string;
  images: string[];
  category: { name: string; slug: string };
  isFeatured: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images?.[0] ?? "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80";

  return (
    <motion.div
      initial={false}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group relative overflow-hidden rounded-2xl border bg-card shadow-soft"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            className={cn("object-cover transition-transform duration-500 group-hover:scale-[1.03]")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {product.category.name}
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-[family-name:var(--font-playfair)] text-lg">
              {product.name}
            </h3>
          </div>
          <p className="mt-2 text-sm font-semibold">{formatMoney(product.priceCents, product.currency)}</p>
        </div>
      </Link>

      <div className="absolute right-3 top-3">
        <WishlistButton productId={product.id} className="bg-background/90 backdrop-blur" />
      </div>
    </motion.div>
  );
}

