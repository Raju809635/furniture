"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { Button } from "@/components/ui/button";

export function WishlistButton({
  productId,
  className
}: {
  productId: string;
  className?: string;
}) {
  const { toggle, has } = useWishlist();
  const active = has(productId);
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={(e) => {
        e.preventDefault();
        toggle(productId);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-4 w-4", active ? "fill-primary text-primary" : "text-foreground")} />
    </Button>
  );
}

