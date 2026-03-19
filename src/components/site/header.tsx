import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { CartButton } from "@/components/cart/cart-button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <Link className="hover:text-foreground transition-colors" href="/shop">
              Shop
            </Link>
            <Link className="hover:text-foreground transition-colors" href="/about">
              About
            </Link>
            <Link className="hover:text-foreground transition-colors" href="/contact">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/shop">Explore Collection</Link>
          </Button>
          <CartSheet trigger={<CartButton />} />
        </div>
      </div>
    </header>
  );
}

