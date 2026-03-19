import { ProductCard, type ProductCardData } from "@/components/product/product-card";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground shadow-soft">
        No products found. Try a different filter.
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

