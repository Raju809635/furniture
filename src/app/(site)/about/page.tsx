import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us"
};

export default function AboutPage() {
  return (
    <div className="container py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">About</p>
        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl">WoodNest Interiors</h1>
        <p className="mt-5 text-muted-foreground">
          WoodNest Interiors is built on a simple idea: great furniture should feel warm, look
          timeless, and fit naturally into modern homes. We focus on premium finishes, clean lines,
          and quality materials—so every piece elevates your space without shouting.
        </p>
        <div className="mt-8 grid gap-5 rounded-2xl border bg-card p-6 shadow-soft">
          <div>
            <p className="text-sm font-semibold">What we make</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sofas, beds, chairs, tables, and storage crafted for comfort &amp; durability.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">How we help</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick enquiries, WhatsApp ordering, and personalized recommendations for your room size
              and style.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/shop">Shop</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

