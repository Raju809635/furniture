import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";

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

  const where: any = { isActive: true };
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  if (category) where.category = { slug: category };
  if (featured) where.isFeatured = true;
  if (min || max) {
    where.priceCents = {};
    if (min) where.priceCents.gte = Number(min) * 100;
    if (max) where.priceCents.lte = Number(max) * 100;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true, slug: true } } }
  });

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      priceCents: p.priceCents,
      currency: p.currency,
      images: Array.isArray(p.images) ? p.images : (p.images as any),
      materials: p.materials,
      dimensions: p.dimensions,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      category: p.category
    }))
  );
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

