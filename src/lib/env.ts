import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),

  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),

  WHATSAPP_PHONE_E164: z.string().min(8).optional(),
  NEXT_PUBLIC_WHATSAPP_PHONE_E164: z.string().min(8).optional()
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    WHATSAPP_PHONE_E164: process.env.WHATSAPP_PHONE_E164,
    NEXT_PUBLIC_WHATSAPP_PHONE_E164: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_E164
  });

  if (!parsed.success) {
    // Avoid crashing builds on Vercel when env vars aren't configured yet.
    // Runtime routes that require env should validate explicitly.
    cached = {};
    return cached;
  }
  cached = parsed.data;
  return cached;
}

export function requireEnv<K extends keyof AppEnv>(key: K): NonNullable<AppEnv[K]> {
  const value = getEnv()[key];
  if (!value) throw new Error(`Missing required env var: ${String(key)}`);
  return value as NonNullable<AppEnv[K]>;
}

