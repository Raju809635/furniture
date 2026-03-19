import { mockCategories, mockProducts, type CategoryData, type ProductData } from "@/data/catalog";
import { isDbEnabled } from "@/lib/backend";

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

function normalizeImages(images: unknown): string[] {
  if (Array.isArray(images)) return images.filter((x) => typeof x === "string") as string[];
  const maybe = (images as any)?.images;
  if (Array.isArray(maybe)) return maybe.filter((x: any) => typeof x === "string");
  return [];
}

async function db() {
  const { getPrisma } = await import("@/lib/prisma");
  return getPrisma();
}

export async function getCategories(): Promise<CategoryData[]> {
  if (!isDbEnabled()) return mockCategories;
  const prisma = await db();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  if (!isDbEnabled()) return mockProducts.find((p) => p.slug === slug && p.isActive) ?? null;
  const prisma = await db();
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true }
  });
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency,
    images: normalizeImages(product.images),
    materials: product.materials ?? undefined,
    dimensions: product.dimensions ?? undefined,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    category: { name: product.category.name, slug: product.category.slug },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

export async function getProductById(id: string): Promise<ProductData | null> {
  if (!isDbEnabled()) return mockProducts.find((p) => p.id === id) ?? null;
  const prisma = await db();
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency,
    images: normalizeImages(product.images),
    materials: product.materials ?? undefined,
    dimensions: product.dimensions ?? undefined,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    category: { name: product.category.name, slug: product.category.slug },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

export async function getFeaturedProducts(take = 6): Promise<ProductData[]> {
  if (!isDbEnabled()) return mockProducts.filter((p) => p.isActive && p.isFeatured).slice(0, take);
  const prisma = await db();
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take,
    include: { category: { select: { name: true, slug: true } } }
  });
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    priceCents: p.priceCents,
    currency: p.currency,
    images: normalizeImages(p.images),
    materials: p.materials ?? undefined,
    dimensions: p.dimensions ?? undefined,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    category: p.category,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }));
}

export async function getCatalogData(params: CatalogParams) {
  const q = (params.q ?? "").trim();
  const category = (params.category ?? "").trim();
  const min = toInt(params.min);
  const max = toInt(params.max);
  const sort = (params.sort ?? "newest").trim();

  const categories = await getCategories();

  if (!isDbEnabled()) {
    let list = mockProducts.filter((p) => p.isActive);
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }
    if (category) list = list.filter((p) => p.category.slug === category);
    if (min !== undefined) list = list.filter((p) => p.priceCents >= min * 100);
    if (max !== undefined) list = list.filter((p) => p.priceCents <= max * 100);

    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    else list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return { categories, products: list, applied: { q, category, min, max, sort } };
  }

  const prisma = await db();
  const where: any = { isActive: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } }
    ];
  }
  if (category) where.category = { slug: category };
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

  const dbProducts = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: { select: { name: true, slug: true } } }
  });

  const products: ProductData[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    priceCents: p.priceCents,
    currency: p.currency,
    images: normalizeImages(p.images),
    materials: p.materials ?? undefined,
    dimensions: p.dimensions ?? undefined,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    category: p.category,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }));

  return { categories, products, applied: { q, category, min, max, sort } };
}
