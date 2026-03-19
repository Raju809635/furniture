import { getEnv } from "@/lib/env";

export function isDbEnabled() {
  const env = getEnv();
  return Boolean(env.DATABASE_URL);
}

export function isAdminAuthEnabled() {
  const env = getEnv();
  return Boolean(env.DATABASE_URL && env.NEXTAUTH_SECRET);
}

export function isShowcaseMode() {
  return process.env.SHOWCASE_MODE === "1" || !isDbEnabled();
}

