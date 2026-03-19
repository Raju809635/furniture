import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export async function CategoryStrip() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <section className="container py-10">
      <div className="flex flex-wrap gap-3 rounded-2xl border bg-card p-4 shadow-soft">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={cn(
              "rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

