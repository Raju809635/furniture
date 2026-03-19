import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin backend disabled" }, { status: 501 });

  const prisma = getPrisma();
  const products = await prisma.product.count({ where: { categoryId: params.id } });
  if (products > 0) {
    return NextResponse.json({ error: "Category has products" }, { status: 400 });
  }
  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
