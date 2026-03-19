import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-10">
      <Skeleton className="h-4 w-64" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
        <div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-4 h-6 w-40" />
          <Skeleton className="mt-6 h-24 w-full" />
          <Skeleton className="mt-6 h-40 w-full rounded-2xl" />
          <div className="mt-6 flex gap-3">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

