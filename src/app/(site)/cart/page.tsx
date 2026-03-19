"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-context";
import { formatMoney } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type EnquiryPayload = {
  name: string;
  phone: string;
  message?: string;
  items: Array<{ productId: string; qty: number }>;
};

export default function CartPage() {
  const { items, setQty, removeItem, clear, totalCents } = useCart();
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");

  const currency = items[0]?.currency ?? "INR";
  const subtotal = formatMoney(totalCents, currency);

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_E164 ?? "";
  const whatsappMessage = `Hi WoodNest Interiors, I'd like to enquire about:\n${items
    .map((i) => `• ${i.name} × ${i.qty}`)
    .join("\n")}\nSubtotal: ${subtotal}\nName: ${name || "-"}\nPhone: ${phone || "-"}\nMessage: ${message || "-"}`;
  const whatsappLink = whatsappPhone ? buildWhatsAppLink(whatsappPhone, whatsappMessage) : null;

  async function submit() {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone");
      return;
    }
    setLoading(true);
    try {
      const payload: EnquiryPayload = {
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty }))
      };
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed");
      clear();
      toast.success("Enquiry sent — we’ll contact you shortly");
    } catch {
      toast.error("Could not send enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Cart</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl">Enquiry</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add items and send an enquiry. Prefer WhatsApp? Use the quick order button.
          </p>
        </div>
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,420px]">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
                Your cart is empty. <Link className="underline" href="/shop">Browse products</Link>.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 rounded-2xl border bg-card p-4">
                    <Link href={`/product/${item.slug}`} className="relative h-20 w-20 overflow-hidden rounded-xl border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${item.slug}`} className="truncate text-sm font-semibold hover:underline">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatMoney(item.priceCents, item.currency)}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <Label className="text-xs text-muted-foreground">Qty</Label>
                        <Input
                          type="number"
                          min={1}
                          className="h-9 w-20"
                          value={item.qty}
                          onChange={(e) => setQty(item.productId, Math.max(1, Number(e.target.value)))}
                        />
                        <Button variant="ghost" className="h-9 px-2 text-muted-foreground" onClick={() => removeItem(item.productId)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-6" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{subtotal}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Send enquiry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Room size, color preference, delivery pin code..." />
            </div>

            <div className="grid gap-2">
              <Button size="lg" onClick={submit} disabled={loading}>
                {loading ? "Sending..." : "Submit enquiry"}
              </Button>
              {whatsappLink ? (
                <Button asChild size="lg" variant="secondary" disabled={items.length === 0}>
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    Quick order on WhatsApp
                  </a>
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Set `NEXT_PUBLIC_WHATSAPP_PHONE_E164` to enable WhatsApp checkout.
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              By submitting, you agree to be contacted about your order enquiry.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 sm:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}

