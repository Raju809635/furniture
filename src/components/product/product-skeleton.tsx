import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-6 w-3/4" />
            <Skeleton className="mt-3 h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

