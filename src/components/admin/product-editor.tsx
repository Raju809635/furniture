"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Category = { id: string; name: string; slug: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;
  images: string[];
  materials: string | null;
  dimensions: string | null;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
};

export function ProductEditor({ productId }: { productId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [product, setProduct] = React.useState<Product | null>(null);

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [priceRupees, setPriceRupees] = React.useState<number>(0);
  const [currency, setCurrency] = React.useState("INR");
  const [materials, setMaterials] = React.useState("");
  const [dimensions, setDimensions] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/categories");
      const cats = (await res.json()) as Category[];
      setCategories(cats);
      if (!productId && cats[0]) setCategoryId(cats[0].id);
    })();
  }, [productId]);

  React.useEffect(() => {
    if (!productId) return;
    (async () => {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) return;
      const p = (await res.json()) as any;
      const normalized: Product = {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceCents: p.priceCents,
        currency: p.currency,
        images: Array.isArray(p.images) ? p.images : [],
        materials: p.materials,
        dimensions: p.dimensions,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        categoryId: p.categoryId
      };
      setProduct(normalized);
      setName(normalized.name);
      setSlug(normalized.slug);
      setDescription(normalized.description);
      setPriceRupees(Math.round(normalized.priceCents / 100));
      setCurrency(normalized.currency);
      setImages(normalized.images);
      setMaterials(normalized.materials ?? "");
      setDimensions(normalized.dimensions ?? "");
      setIsFeatured(normalized.isFeatured);
      setIsActive(normalized.isActive);
      setCategoryId(normalized.categoryId);
    })();
  }, [productId]);

  async function save() {
    if (!name.trim() || !description.trim() || !categoryId) {
      toast.error("Name, description and category are required");
      return;
    }
    if (!images.length) {
      toast.error("Upload at least one image");
      return;
    }
    if (!priceRupees || priceRupees < 1) {
      toast.error("Enter a valid price");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        categoryId,
        priceRupees: Number(priceRupees),
        currency,
        images,
        materials: materials.trim() || null,
        dimensions: dimensions.trim() || null,
        isFeatured,
        isActive
      };

      const res = await fetch(productId ? `/api/products/${productId}` : "/api/products", {
        method: productId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Saved");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Could not save product");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!productId) return;
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.message("Deleted");
      router.push("/admin/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>{productId ? "Edit product" : "New product"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated if empty" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                inputMode="numeric"
                value={String(priceRupees || "")}
                onChange={(e) => setPriceRupees(Number(e.target.value))}
                placeholder="e.g. 49999"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="materials">Materials</Label>
            <Input id="materials" value={materials} onChange={(e) => setMaterials(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input id="dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
          </div>

          <Separator />
          <div className="grid gap-2">
            <Label>Images</Label>
            <ImageUploader value={images} onChange={setImages} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Publish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer items-center justify-between rounded-xl border bg-card p-3 text-sm">
            <span>Active</span>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          </label>
          <label className="flex cursor-pointer items-center justify-between rounded-xl border bg-card p-3 text-sm">
            <span>Featured</span>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          </label>
          <div className="grid gap-2">
            <Button size="lg" onClick={save} disabled={loading}>
              {loading ? "Saving..." : "Save product"}
            </Button>
            {productId ? (
              <Button variant="destructive" onClick={remove} disabled={loading}>
                Delete product
              </Button>
            ) : null}
          </div>
          {product ? (
            <p className="text-xs text-muted-foreground">
              Editing: <span className="font-medium text-foreground">{product.name}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

