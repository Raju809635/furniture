import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

export default async function ProtectedAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");
  return <>{children}</>;
}

