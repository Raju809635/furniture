import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

export function configureCloudinary() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return null;
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
  });
  return cloudinary;
}

export function cloudinarySignature(paramsToSign: Record<string, string | number>) {
  if (!env.CLOUDINARY_API_SECRET) throw new Error("CLOUDINARY_API_SECRET not configured");

  const sorted = Object.entries(paramsToSign)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(sorted + env.CLOUDINARY_API_SECRET)
    .digest("hex");

  return signature;
}

