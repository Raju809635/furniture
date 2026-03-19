import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, categories, enquiries] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.enquiry.count()
  ]);

  return (
    <AdminShell active="/admin">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Admin</p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl">Dashboard</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{products}</p>
            <p className="mt-1 text-sm text-muted-foreground">Active catalog items.</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{categories}</p>
            <p className="mt-1 text-sm text-muted-foreground">Shop categories.</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{enquiries}</p>
            <p className="mt-1 text-sm text-muted-foreground">Customer enquiries received.</p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
