import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-editor";

export default function AdminNewProductPage() {
  return (
    <AdminShell active="/admin/products">
      <ProductEditor />
    </AdminShell>
  );
}
