"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ProductActions({ id }: { id: string }) {
  const router = useRouter();

  async function remove() {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete");
      return;
    }
    toast.message("Deleted");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="outline" className="h-9">
        <Link href={`/admin/products/${id}/edit`}>Edit</Link>
      </Button>
      <Button variant="destructive" className="h-9" onClick={remove}>
        Delete
      </Button>
    </div>
  );
}

