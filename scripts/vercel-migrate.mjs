import { execSync } from "node:child_process";

const isVercel = process.env.VERCEL === "1";
const vercelEnv = process.env.VERCEL_ENV; // "production" | "preview" | "development"
const databaseUrl = process.env.DATABASE_URL;
const showcaseMode = process.env.SHOWCASE_MODE === "1";

if (showcaseMode) {
  console.log("[vercel-migrate] Skipping: SHOWCASE_MODE=1.");
  process.exit(0);
}

if (!databaseUrl) {
  console.log("[vercel-migrate] Skipping: DATABASE_URL not set.");
  process.exit(0);
}

if (isVercel && vercelEnv && vercelEnv !== "production") {
  console.log(`[vercel-migrate] Skipping for Vercel env: ${vercelEnv}.`);
  process.exit(0);
}

console.log("[vercel-migrate] Running prisma migrate deploy...");
execSync("prisma migrate deploy", { stdio: "inherit" });
