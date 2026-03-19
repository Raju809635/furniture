import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";
import { getCategories } from "@/lib/store";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional()
});

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin backend disabled" }, { status: 501 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const slug = slugify(parsed.data.slug?.trim() || parsed.data.name);
  const prisma = getPrisma();
  const category = await prisma.category.create({
    data: { name: parsed.data.name.trim(), slug }
  });
  return NextResponse.json(category, { status: 201 });
}
