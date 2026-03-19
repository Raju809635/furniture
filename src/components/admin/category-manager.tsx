"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Category = { id: string; name: string; slug: string };

export function CategoryManager() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function refresh() {
    const res = await fetch("/api/categories");
    setCategories((await res.json()) as Category[]);
  }

  React.useEffect(() => {
    refresh();
  }, []);

  async function create() {
    if (!name.trim()) return toast.error("Enter a category name");
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() || undefined })
      });
      if (!res.ok) throw new Error("Create failed");
      setName("");
      setSlug("");
      toast.success("Category created");
      await refresh();
    } catch {
      toast.error("Could not create category");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Could not delete category");
      return;
    }
    toast.message("Deleted");
    await refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Add category</CardTitle>
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
          <Button onClick={create} disabled={loading}>
            {loading ? "Creating..." : "Create category"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Tip: Use slugs like `sofas`, `beds`, `chairs`, `tables`, `storage`.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Existing categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y overflow-hidden rounded-xl border bg-card">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.slug}</p>
                </div>
                <Button variant="destructive" className="h-9" onClick={() => remove(c.id)}>
                  Delete
                </Button>
              </div>
            ))}
            {categories.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">No categories yet.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

