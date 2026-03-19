import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  message: z.string().optional(),
  items: z.array(z.object({ productId: z.string().min(1), qty: z.number().int().positive() })).min(1)
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const created = await prisma.enquiry.create({
    data: {
      name: parsed.data.name.trim(),
      phone: parsed.data.phone.trim(),
      message: parsed.data.message?.trim() || null,
      items: parsed.data.items as any
    }
  });

  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(enquiries);
}

