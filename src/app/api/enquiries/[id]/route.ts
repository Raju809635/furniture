import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"])
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin backend disabled" }, { status: 501 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const prisma = getPrisma();
  const updated = await prisma.enquiry.update({
    where: { id: params.id },
    data: { status: parsed.data.status }
  });
  return NextResponse.json(updated);
}
