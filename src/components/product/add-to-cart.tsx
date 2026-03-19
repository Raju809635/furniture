"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";

export function AddToCartButton({
  product
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    priceCents: number;
    currency: string;
  };
}) {
  const { addItem } = useCart();
  return (
    <Button
      size="lg"
      onClick={() => {
        addItem(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            priceCents: product.priceCents,
            currency: product.currency
          },
          1
        );
        toast.success("Added to cart");
      }}
    >
      Add to cart
    </Button>
  );
}

