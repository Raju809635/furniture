import { prisma } from "@/lib/prisma";

export type CatalogParams = {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
};

function toInt(value: string | undefined) {
  if (!value) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.trunc(n);
}

export async function getCatalogData(params: CatalogParams) {
  const q = (params.q ?? "").trim();
  const category = (params.category ?? "").trim();
  const min = toInt(params.min);
  const max = toInt(params.max);
  const sort = (params.sort ?? "newest").trim();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const where: any = { isActive: true };
  if (q) {
    where.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  }
  if (category) {
    where.category = { slug: category };
  }
  if (min !== undefined || max !== undefined) {
    where.priceCents = {};
    if (min !== undefined) where.priceCents.gte = min * 100;
    if (max !== undefined) where.priceCents.lte = max * 100;
  }

  const orderBy =
    sort === "price-asc"
      ? { priceCents: "asc" as const }
      : sort === "price-desc"
        ? { priceCents: "desc" as const }
        : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: { select: { name: true, slug: true } } }
  });

  return { categories, products, applied: { q, category, min, max, sort } };
}

