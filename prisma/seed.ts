import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

async function main() {
  const adminEmail = requiredEnv("ADMIN_EMAIL").toLowerCase().trim();
  const adminPassword = requiredEnv("ADMIN_PASSWORD");

  const categories = [
    { name: "Sofas", slug: "sofas" },
    { name: "Beds", slug: "beds" },
    { name: "Chairs", slug: "chairs" },
    { name: "Tables", slug: "tables" },
    { name: "Storage", slug: "storage" }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category
    });
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN" },
    create: { email: adminEmail, passwordHash, role: "ADMIN", name: "Admin" }
  });

  const sofa = await prisma.category.findUnique({ where: { slug: "sofas" } });
  if (!sofa) return;

  const sample = [
    {
      name: "Aurelia Luxe Sofa",
      slug: "aurelia-luxe-sofa",
      description:
        "A premium 3-seater with a warm linen finish—crafted for comfort, built for presence.",
      priceCents: 8999900,
      images: [
        "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: "Solid wood frame, high-density foam, linen upholstery",
      dimensions: "W 210cm × D 90cm × H 82cm",
      isFeatured: true,
      categoryId: sofa.id
    },
    {
      name: "Cedarline Coffee Table",
      slug: "cedarline-coffee-table",
      description:
        "A minimalist table with rich wood grain and rounded edges—designed to soften modern spaces.",
      priceCents: 3499900,
      images: [
        "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80"
      ],
      materials: "Engineered wood with veneer finish",
      dimensions: "W 110cm × D 60cm × H 42cm",
      isFeatured: true,
      categoryId: (await prisma.category.findUnique({ where: { slug: "tables" } }))!.id
    }
  ];

  for (const product of sample) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        images: product.images as any,
        materials: product.materials,
        dimensions: product.dimensions,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId
      },
      create: product as any
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

