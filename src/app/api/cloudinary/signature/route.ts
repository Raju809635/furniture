import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { cloudinarySignature } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const schema = z.object({
  timestamp: z.number().int().positive(),
  folder: z.string().optional()
});

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const { timestamp, folder } = parsed.data;
  const paramsToSign: Record<string, string | number> = { timestamp };
  if (folder) paramsToSign.folder = folder;

  const signature = cloudinarySignature(paramsToSign);

  return NextResponse.json({
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    signature,
    timestamp,
    folder: folder ?? "woodnest/products"
  });
}

