import { ProductGridSkeleton } from "@/components/product/product-skeleton";

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="h-[420px] animate-pulse rounded-2xl border bg-muted" />
        <ProductGridSkeleton />
      </div>
    </div>
  );
}

