import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isAdminAuthEnabled } from "@/lib/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminLoginPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const callbackUrl = typeof searchParams.callbackUrl === "string" ? searchParams.callbackUrl : "/admin";

  if (!isAdminAuthEnabled()) {
    return (
      <div className="container flex min-h-dvh items-center justify-center py-14">
        <Card className="w-full max-w-md bg-background">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-playfair)] text-2xl">
              Admin (Coming soon)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This showcase deployment doesn’t include the admin backend. Add a database later to enable admin login.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminLoginForm callbackUrl={callbackUrl} />;
}
