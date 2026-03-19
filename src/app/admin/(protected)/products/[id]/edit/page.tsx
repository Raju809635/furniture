import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-editor";

export default function AdminEditProductPage({ params }: { params: { id: string } }) {
  return (
    <AdminShell active="/admin/products">
      <ProductEditor productId={params.id} />
    </AdminShell>
  );
}
