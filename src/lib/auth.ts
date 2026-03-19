import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { requireEnv } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";
import { isAdminAuthEnabled } from "@/lib/backend";

export function getAuthOptions(): NextAuthOptions {
  if (!isAdminAuthEnabled()) {
    throw new Error("Admin auth is disabled (missing DATABASE_URL / NEXTAUTH_SECRET).");
  }

  requireEnv("NEXTAUTH_SECRET");
  const prisma = getPrisma();

  return {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    pages: { signIn: "/admin/login" },
    providers: [
      CredentialsProvider({
        name: "Admin Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          const email = (credentials?.email ?? "").toLowerCase().trim();
          const password = credentials?.password ?? "";
          if (!email || !password) return null;

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user?.passwordHash) return null;
          if (user.role !== "ADMIN") return null;

          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;

          return { id: user.id, email: user.email, name: user.name ?? "Admin", role: user.role };
        }
      })
    ],
    callbacks: {
      async session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          // @ts-expect-error role is added via types augmentation
          session.user.role = (user as any).role ?? "ADMIN";
        }
        return session;
      }
    }
  };
}

