import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-10 text-center shadow-soft">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/shop">Shop</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

