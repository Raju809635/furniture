import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export async function GET(req: Request, ctx: any) {
  const handler = NextAuth(getAuthOptions());
  // @ts-expect-error NextAuth handler accepts App Router context
  return handler(req, ctx);
}

export async function POST(req: Request, ctx: any) {
  const handler = NextAuth(getAuthOptions());
  // @ts-expect-error NextAuth handler accepts App Router context
  return handler(req, ctx);
}
