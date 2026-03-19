import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";
import { getCatalogData } from "@/lib/store";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  priceRupees: z.number().int().positive(),
  currency: z.string().default("INR"),
  images: z.array(z.string().url()).min(1),
  materials: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional()
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const category = (url.searchParams.get("category") ?? "").trim();
  const featured = url.searchParams.get("featured") === "1";
  const min = url.searchParams.get("min");
  const max = url.searchParams.get("max");

  const { products } = await getCatalogData({
    q,
    category,
    min: min ?? undefined,
    max: max ?? undefined,
    sort: "newest"
  });

  const filtered = featured ? products.filter((p) => p.isFeatured) : products;

  return NextResponse.json(
    filtered.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      priceCents: p.priceCents,
      currency: p.currency,
      images: p.images,
      materials: p.materials ?? null,
      dimensions: p.dimensions ?? null,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      category: p.category
    }))
  );
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin backend disabled" }, { status: 501 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const slug = slugify(data.slug?.trim() || data.name);

  let categoryId = data.categoryId;
  if (!categoryId && data.categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
    categoryId = category?.id;
  }
  if (!categoryId) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  const prisma = getPrisma();
  const created = await prisma.product.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description.trim(),
      priceCents: data.priceRupees * 100,
      currency: data.currency,
      images: data.images as any,
      materials: data.materials ?? null,
      dimensions: data.dimensions ?? null,
      categoryId,
      isFeatured: data.isFeatured ?? false,
      isActive: data.isActive ?? true
    }
  });

  return NextResponse.json(created, { status: 201 });
}
