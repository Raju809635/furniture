import { getCatalogData } from "@/lib/catalog";
import { SearchBox } from "@/components/shop/search-box";
import { CatalogFilters } from "@/components/shop/filters";
import { ProductGrid } from "@/components/product/product-grid";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { categories, products, applied } = await getCatalogData({
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    category: typeof searchParams.category === "string" ? searchParams.category : undefined,
    min: typeof searchParams.min === "string" ? searchParams.min : undefined,
    max: typeof searchParams.max === "string" ? searchParams.max : undefined,
    sort: typeof searchParams.sort === "string" ? searchParams.sort : undefined
  });

  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    currency: p.currency,
    images: Array.isArray(p.images) ? (p.images as string[]) : ((p.images as any)?.images ?? []),
    category: p.category,
    isFeatured: p.isFeatured
  }));

  return (
    <div className="container py-10" id="collection">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Shop</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl">Explore Collection</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {applied.q ? (
              <>
                Showing results for <span className="font-medium text-foreground">“{applied.q}”</span>
              </>
            ) : (
              <>Luxury modern pieces in warm wood tones.</>
            )}
          </p>
        </div>
        <div className="w-full md:w-[360px]">
          <SearchBox />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <CatalogFilters categories={categories} />
        <ProductGrid products={mapped} />
      </div>
    </div>
  );
}

