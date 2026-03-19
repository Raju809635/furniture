import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-baseline gap-2", className)}>
      <span className="font-[family-name:var(--font-playfair)] text-xl tracking-tight">
        WoodNest
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground group-hover:text-foreground transition-colors">
        Interiors
      </span>
    </Link>
  );
}

