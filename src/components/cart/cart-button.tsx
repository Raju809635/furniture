"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CartButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  const { totalItems } = useCart();
  return (
    <Button variant="outline" className={cn("relative", className)} onClick={onClick}>
      <ShoppingBag className="h-4 w-4" />
      <span className="hidden sm:inline">Cart</span>
      {totalItems > 0 ? (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {totalItems}
        </span>
      ) : null}
    </Button>
  );
}

