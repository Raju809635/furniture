import { getPrisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { EnquiryStatus } from "@/components/admin/enquiry-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const prisma = getPrisma();
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell active="/admin/enquiries">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Admin</p>
        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl">Enquiries</h1>
      </div>

      <div className="mt-8 grid gap-5">
        {enquiries.map((e) => (
          <Card key={e.id} className="bg-background">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div className="min-w-0">
                <CardTitle className="truncate text-base">{e.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {e.phone} · {new Date(e.createdAt).toLocaleString()}
                </p>
              </div>
              <EnquiryStatus id={e.id} status={e.status} />
            </CardHeader>
            <CardContent className="space-y-3">
              {e.message ? (
                <div>
                  <p className="text-sm font-semibold">Message</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.message}</p>
                </div>
              ) : null}
              <div>
                <p className="text-sm font-semibold">Items</p>
                <pre className="mt-1 overflow-auto rounded-xl border bg-card p-3 text-xs text-muted-foreground">
                  {JSON.stringify(e.items, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
        {enquiries.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground shadow-soft">
            No enquiries yet.
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
