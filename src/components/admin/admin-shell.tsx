import Link from "next/link";
import type * as React from "react";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/enquiries", label: "Enquiries" }
];

export function AdminShell({
  children,
  active
}: {
  children: React.ReactNode;
  active?: string;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-4 text-sm md:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    active === n.href ? "text-foreground font-medium" : ""
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <AdminUserMenu />
        </div>
      </header>
      <main className="container py-10">{children}</main>
    </div>
  );
}
