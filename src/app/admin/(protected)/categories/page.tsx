import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryManager } from "@/components/admin/category-manager";

export default function AdminCategoriesPage() {
  return (
    <AdminShell active="/admin/categories">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Admin</p>
        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl">Categories</h1>
      </div>
      <div className="mt-8">
        <CategoryManager />
      </div>
    </AdminShell>
  );
}
