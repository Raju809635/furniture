import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const images = [
  {
    alt: "Luxury sofa",
    src: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1600&q=80"
  },
  {
    alt: "Modern bed",
    src: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    alt: "Wood table",
    src: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1600&q=80"
  }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--secondary)),transparent_60%)]" />
      <div className="container grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <p className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            WoodNest Interiors
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-4xl leading-tight md:text-5xl">
            Crafting Comfort &amp; Style
          </h1>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Curated luxury furniture in warm wood tones—made for modern living rooms, bedrooms, and
            spaces that feel like home.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/shop#collection">Explore Collection</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border bg-card p-4 shadow-soft">
            <div>
              <p className="text-xs text-muted-foreground">Materials</p>
              <p className="mt-1 text-sm font-semibold">Solid wood</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Finish</p>
              <p className="mt-1 text-sm font-semibold">Premium tones</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivery</p>
              <p className="mt-1 text-sm font-semibold">Pan India</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-3xl border bg-card shadow-soft">
            <div className="relative aspect-[3/4]">
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-soft">
              <div className="relative aspect-[4/3]">
                <Image
                  src={images[1].src}
                  alt={images[1].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-soft">
              <div className="relative aspect-[4/3]">
                <Image
                  src={images[2].src}
                  alt={images[2].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

