"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminUserMenu() {
  const session = useSession();
  const email = session.data?.user?.email ?? "Admin";
  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground sm:flex">
        <Shield className="h-3.5 w-3.5" />
        <span className="max-w-[220px] truncate">{email}</span>
      </div>
      <Button
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </div>
  );
}

