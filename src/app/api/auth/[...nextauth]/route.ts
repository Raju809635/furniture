import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export async function GET(req: Request, ctx: any) {
  try {
    const handler = NextAuth(getAuthOptions()) as any;
    return handler(req, ctx);
  } catch {
    return new Response("Admin auth disabled", { status: 501 });
  }
}

export async function POST(req: Request, ctx: any) {
  try {
    const handler = NextAuth(getAuthOptions()) as any;
    return handler(req, ctx);
  } catch {
    return new Response("Admin auth disabled", { status: 501 });
  }
}
