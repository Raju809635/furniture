import Link from "next/link";
import { getFeaturedProducts } from "@/lib/store";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(6);
  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    currency: p.currency,
    images: p.images,
    category: p.category,
    isFeatured: p.isFeatured
  }));

  return (
    <section className="container py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Featured</p>
          <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl">
            Handpicked highlights
          </h2>
        </div>
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/shop">View all</Link>
        </Button>
      </div>
      <div className="mt-8">
        <ProductGrid products={mapped} />
      </div>
      <div className="mt-8 sm:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href="/shop">View all</Link>
        </Button>
      </div>
    </section>
  );
}
