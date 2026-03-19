import Link from "next/link";
import { Hero } from "@/components/site/hero";
import { FeaturedProducts } from "@/components/site/featured-products";
import { Testimonials } from "@/components/site/testimonials";
import { CategoryStrip } from "@/components/site/category-strip";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
      <Testimonials />

      <section className="container pb-20">
        <div className="rounded-3xl border bg-[radial-gradient(circle_at_top,hsl(var(--secondary)),transparent_55%)] p-10 shadow-soft md:p-14">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Concierge support
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl md:text-4xl">
              Need help choosing the perfect piece?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Share your room size, style preferences, and budget—our team will recommend options that
              match your space.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/shop">Browse Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

