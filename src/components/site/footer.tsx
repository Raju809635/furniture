import Link from "next/link";
import { Logo } from "@/components/site/logo";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Crafting Comfort &amp; Style with warm tones, clean lines, and premium finishes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-semibold">Company</p>
              <Link className="block text-muted-foreground hover:text-foreground" href="/about">
                About Us
              </Link>
              <Link className="block text-muted-foreground hover:text-foreground" href="/contact">
                Contact
              </Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Shop</p>
              <Link className="block text-muted-foreground hover:text-foreground" href="/shop?category=sofas">
                Sofas
              </Link>
              <Link className="block text-muted-foreground hover:text-foreground" href="/shop?category=beds">
                Beds
              </Link>
              <Link className="block text-muted-foreground hover:text-foreground" href="/shop?category=tables">
                Tables
              </Link>
              <Link className="block text-muted-foreground hover:text-foreground" href="/shop?category=storage">
                Storage
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} WoodNest Interiors. All rights reserved.</p>
          <p>Built with Next.js · Prisma · Cloudinary</p>
        </div>
      </div>
    </footer>
  );
}

