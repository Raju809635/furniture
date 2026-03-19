import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  description: z.string().min(10).optional(),
  priceRupees: z.number().int().positive().optional(),
  currency: z.string().optional(),
  images: z.array(z.string().url()).min(1).optional(),
  materials: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  categoryId: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional()
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: { select: { id: true, name: true, slug: true } } }
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...product,
    images: Array.isArray(product.images) ? product.images : (product.images as any)
  });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const update: any = {};
  if (data.name) update.name = data.name.trim();
  if (data.slug) update.slug = slugify(data.slug);
  if (data.description) update.description = data.description.trim();
  if (data.priceRupees !== undefined) update.priceCents = data.priceRupees * 100;
  if (data.currency) update.currency = data.currency;
  if (data.images) update.images = data.images as any;
  if (data.materials !== undefined) update.materials = data.materials;
  if (data.dimensions !== undefined) update.dimensions = data.dimensions;
  if (data.categoryId) update.categoryId = data.categoryId;
  if (data.isFeatured !== undefined) update.isFeatured = data.isFeatured;
  if (data.isActive !== undefined) update.isActive = data.isActive;

  const updated = await prisma.product.update({ where: { id: params.id }, data: update });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

