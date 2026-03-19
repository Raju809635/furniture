import { getServerSession } from "next-auth/next";
import { getAuthOptions } from "@/lib/auth";

export async function requireAdmin() {
  try {
    const session = await getServerSession(getAuthOptions());
    const role = (session?.user as any)?.role;
    if (!session?.user?.id || role !== "ADMIN") return null;
    return session;
  } catch {
    return null;
  }
}
