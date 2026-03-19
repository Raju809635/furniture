"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };

function setParam(params: URLSearchParams, key: string, value: string | null) {
  if (!value) params.delete(key);
  else params.set(key, value);
}

export function CatalogFilters({
  categories,
  className
}: {
  categories: Category[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const min = searchParams.get("min") ?? "";
  const max = searchParams.get("max") ?? "";

  function update(next: Partial<{ category: string; sort: string; min: string; max: string }>) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.category !== undefined) setParam(params, "category", next.category || null);
    if (next.sort !== undefined) setParam(params, "sort", next.sort || null);
    if (next.min !== undefined) setParam(params, "min", next.min || null);
    if (next.max !== undefined) setParam(params, "max", next.max || null);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    ["category", "sort", "min", "max", "q", "page"].forEach((k) => params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={cn("grid gap-4 rounded-2xl border bg-card p-4 shadow-soft", className)}>
      <div className="grid gap-2">
        <Label>Category</Label>
        <Select value={category || "all"} onValueChange={(v) => update({ category: v === "all" ? "" : v })}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Price (₹)</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            inputMode="numeric"
            placeholder="Min"
            value={min}
            onChange={(e) => update({ min: e.target.value })}
          />
          <Input
            inputMode="numeric"
            placeholder="Max"
            value={max}
            onChange={(e) => update({ max: e.target.value })}
          />
        </div>
        <p className="text-xs text-muted-foreground">Filters use rupees (e.g. 19999).</p>
      </div>

      <div className="grid gap-2">
        <Label>Sort</Label>
        <Select value={sort} onValueChange={(v) => update({ sort: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Button variant="secondary" onClick={clear}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}

