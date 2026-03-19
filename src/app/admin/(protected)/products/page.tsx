import Link from "next/link";
import Image from "next/image";
import { getPrisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductActions } from "@/components/admin/product-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const prisma = getPrisma();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } }
  });

  return (
    <AdminShell active="/admin/products">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Admin</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl">Products</h1>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="grid grid-cols-[1.2fr,0.6fr,0.5fr,0.8fr] gap-3 border-b bg-background px-4 py-3 text-xs font-semibold text-muted-foreground">
          <p>Product</p>
          <p>Category</p>
          <p>Status</p>
          <p className="text-right">Actions</p>
        </div>
        <div className="divide-y">
          {products.map((p) => {
            const images = Array.isArray(p.images) ? (p.images as string[]) : ((p.images as any)?.images ?? []);
            const hero = images[0] ?? "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=800&q=80";
            return (
              <div
                key={p.id}
                className="grid grid-cols-[1.2fr,0.6fr,0.5fr,0.8fr] gap-3 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl border bg-background">
                    <Image src={hero} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatMoney(p.priceCents, p.currency)} · /product/{p.slug}
                    </p>
                  </div>
                </div>
                <p className="flex items-center text-sm text-muted-foreground">{p.category.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={p.isActive ? "secondary" : "outline"}>
                    {p.isActive ? "Active" : "Hidden"}
                  </Badge>
                  {p.isFeatured ? <Badge variant="default">Featured</Badge> : null}
                </div>
                <ProductActions id={p.id} />
              </div>
            );
          })}
          {products.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No products yet. <Link className="underline" href="/admin/products/new">Add your first product</Link>.
            </div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
