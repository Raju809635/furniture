"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SignatureResponse = {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
};

async function getSignature(folder?: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const res = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ timestamp, folder })
  });
  if (!res.ok) throw new Error("Signature failed");
  return (await res.json()) as SignatureResponse;
}

export function ImageUploader({
  value,
  onChange
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [uploading, setUploading] = React.useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const sig = await getSignature("woodnest/products");
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", sig.apiKey);
        form.append("timestamp", String(sig.timestamp));
        form.append("signature", sig.signature);
        form.append("folder", sig.folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
          method: "POST",
          body: form
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const json = (await uploadRes.json()) as { secure_url?: string };
        if (!json.secure_url) throw new Error("Upload failed");
        uploaded.push(json.secure_url);
      }

      onChange([...value, ...uploaded]);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error("Upload failed. Check Cloudinary env vars.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        onChange={(e) => upload(e.target.files)}
      />
      {uploading ? <p className="text-xs text-muted-foreground">Uploading...</p> : null}
      {value.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((src) => (
            <div key={src} className="relative overflow-hidden rounded-xl border bg-card">
              <div className="relative aspect-[4/3]">
                <Image src={src} alt="" fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 w-full"
                  onClick={() => onChange(value.filter((x) => x !== src))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Upload at least one product image.</p>
      )}
    </div>
  );
}

