export type CategoryData = { id: string; name: string; slug: string };

export type ProductData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;
  images: string[];
  materials?: string;
  dimensions?: string;
  isFeatured: boolean;
  isActive: boolean;
  category: { name: string; slug: string };
  createdAt: string;
  updatedAt: string;
};

export const mockCategories: CategoryData[] = [
  { id: "c_sofas", name: "Sofas", slug: "sofas" },
  { id: "c_beds", name: "Beds", slug: "beds" },
  { id: "c_chairs", name: "Chairs", slug: "chairs" },
  { id: "c_tables", name: "Tables", slug: "tables" },
  { id: "c_storage", name: "Storage", slug: "storage" }
];

export const mockProducts: ProductData[] = [
  {
    id: "p_aurelia",
    name: "Aurelia Luxe Sofa",
    slug: "aurelia-luxe-sofa",
    description:
      "A premium 3-seater with a warm linen finish—crafted for comfort, built for presence.",
    priceCents: 8999900,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1600&q=80"
    ],
    materials: "Solid wood frame, high-density foam, linen upholstery",
    dimensions: "W 210cm × D 90cm × H 82cm",
    isFeatured: true,
    isActive: true,
    category: { name: "Sofas", slug: "sofas" },
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z"
  },
  {
    id: "p_cedarline",
    name: "Cedarline Coffee Table",
    slug: "cedarline-coffee-table",
    description:
      "A minimalist table with rich wood grain and rounded edges—designed to soften modern spaces.",
    priceCents: 3499900,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80"
    ],
    materials: "Engineered wood with veneer finish",
    dimensions: "W 110cm × D 60cm × H 42cm",
    isFeatured: true,
    isActive: true,
    category: { name: "Tables", slug: "tables" },
    createdAt: "2026-03-02T10:00:00.000Z",
    updatedAt: "2026-03-02T10:00:00.000Z"
  },
  {
    id: "p_harbor",
    name: "Harbor Wing Chair",
    slug: "harbor-wing-chair",
    description:
      "A statement chair with supportive curves and a calm silhouette—perfect for reading corners.",
    priceCents: 1999900,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=80"
    ],
    materials: "Hardwood frame, foam cushioning, textured fabric",
    dimensions: "W 78cm × D 82cm × H 96cm",
    isFeatured: false,
    isActive: true,
    category: { name: "Chairs", slug: "chairs" },
    createdAt: "2026-03-05T10:00:00.000Z",
    updatedAt: "2026-03-05T10:00:00.000Z"
  },
  {
    id: "p_sienna",
    name: "Sienna Storage Console",
    slug: "sienna-storage-console",
    description:
      "Clean-lined storage with soft-close drawers—built to keep spaces calm and clutter-free.",
    priceCents: 4299900,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80"
    ],
    materials: "Engineered wood, matte finish, soft-close hardware",
    dimensions: "W 160cm × D 42cm × H 78cm",
    isFeatured: false,
    isActive: true,
    category: { name: "Storage", slug: "storage" },
    createdAt: "2026-03-08T10:00:00.000Z",
    updatedAt: "2026-03-08T10:00:00.000Z"
  }
];

