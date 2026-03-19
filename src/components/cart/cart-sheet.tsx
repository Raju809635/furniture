"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-context";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function CartSheet({ trigger }: { trigger: React.ReactNode }) {
  const { items, removeItem, setQty, totalCents } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex h-[calc(100vh-160px)] flex-col">
          <div className="flex-1 space-y-4 overflow-auto pr-1">
            {items.length === 0 ? (
              <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                Your cart is empty. Browse the collection and add something you love.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="flex gap-3 rounded-xl border bg-card p-3">
                  <Link href={`/product/${item.slug}`} className="relative h-16 w-16 overflow-hidden rounded-lg border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${item.slug}`} className="truncate text-sm font-medium hover:underline">
                        {item.name}
                      </Link>
                      <Button
                        variant="ghost"
                        className="h-8 px-2 text-muted-foreground"
                        onClick={() => {
                          removeItem(item.productId);
                          toast.message("Removed from cart");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatMoney(item.priceCents, item.currency)}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Qty</span>
                      <Input
                        type="number"
                        min={1}
                        value={item.qty}
                        className="h-9 w-20"
                        onChange={(e) => setQty(item.productId, Math.max(1, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4">
            <Separator />
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatMoney(totalCents, "INR")}</span>
            </div>
            <div className="mt-4 grid gap-2">
              <Button asChild disabled={items.length === 0}>
                <Link href="/cart">Enquire / Checkout</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

