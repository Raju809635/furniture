import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/format";
import { getEnv } from "@/lib/env";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getProductBySlug } from "@/lib/store";
import { AddToCartButton } from "@/components/product/add-to-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  const image = product.images?.[0];
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: image ? [image] : []
    }
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const hero =
    product.images?.[0] ??
    "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1600&q=80";
  const price = formatMoney(product.priceCents, product.currency);

  const env = getEnv();
  const whatsappPhone = env.WHATSAPP_PHONE_E164 ?? env.NEXT_PUBLIC_WHATSAPP_PHONE_E164 ?? "";
  const whatsappMessage = `Hi WoodNest Interiors, I'm interested in "${product.name}" (${price}). Please share availability and delivery details.`;
  const whatsappLink = whatsappPhone ? buildWhatsAppLink(whatsappPhone, whatsappMessage) : null;

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link className="hover:text-foreground" href="/shop">
          Shop
        </Link>
        <span>/</span>
        <Link className="hover:text-foreground" href={`/shop?category=${product.category.slug}`}>
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="truncate text-foreground">{product.name}</span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-card shadow-soft">
            <Image src={hero} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          {product.images.length > 1 ? (
            <div className="grid grid-cols-3 gap-3">
              {product.images.slice(0, 6).map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-card">
                  <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 1024px) 33vw, 16vw" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{product.category.name}</Badge>
            {product.isFeatured ? <Badge variant="default">Featured</Badge> : null}
          </div>
          <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg font-semibold">{price}</p>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <div className="mt-6 grid gap-4 rounded-2xl border bg-card p-5 shadow-soft">
            <div className="grid gap-2">
              <p className="text-sm font-semibold">Materials</p>
              <p className="text-sm text-muted-foreground">{product.materials ?? "—"}</p>
            </div>
            <Separator />
            <div className="grid gap-2">
              <p className="text-sm font-semibold">Dimensions</p>
              <p className="text-sm text-muted-foreground">{product.dimensions ?? "—"}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                image: hero,
                priceCents: product.priceCents,
                currency: product.currency
              }}
            />
            <Button asChild size="lg" variant="outline">
              <Link href="/cart">Enquiry</Link>
            </Button>
            {whatsappLink ? (
              <Button asChild size="lg" variant="secondary">
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  WhatsApp Order
                </a>
              </Button>
            ) : null}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Images are optimized automatically. Replace product images via the Admin Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
