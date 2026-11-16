import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getActiveSalePrice } from "@/lib/promotions";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      price: true,
      salePrice: true,
      saleEndsAt: true,
      slug: true,
      images: { select: { url: true }, orderBy: { position: "asc" }, take: 1 },
      category: { select: { name: true, slug: true } },
    },
  });

  if (!product) return { title: "Produit introuvable" };

  const imageUrl = product.images[0]?.url ?? "/logo-tkai.jpeg";
  const absoluteImage = imageUrl.startsWith("http")
    ? imageUrl
    : `https://tkai-shop.vercel.app${imageUrl}`;
  const description =
    product.description.length > 160
      ? product.description.slice(0, 157) + "..."
      : product.description;

  return {
    title: `${product.name} — ${product.category.name}`,
    description,
    keywords: [
      product.name,
      product.category.name,
      "otaku",
      "streetwear",
      "manga",
      "anime",
      "T-KAI",
    ],
    openGraph: {
      title: `${product.name} | T-KAI Shop`,
      description,
      url: `https://tkai-shop.vercel.app/product/${product.slug}`,
      images: [
        {
          url: absoluteImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | T-KAI Shop`,
      description,
      images: [absoluteImage],
    },
    alternates: {
      canonical: `https://tkai-shop.vercel.app/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
  });

  if (!product) return notFound();

  const sizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean))
  );
  const fallbackSizes = sizes.length ? sizes : ["S", "M", "L", "XL", "XXL"];

  const images =
    product.images.length > 0
      ? product.images.map((img) => ({ url: img.url, color: img.color }))
      : [{ url: "/logo-tkai.jpeg", color: null }];

  const mainImage = images[0]?.url ?? "/logo-tkai.jpeg";
  const absoluteImage = mainImage.startsWith("http")
    ? mainImage
    : `https://tkai-shop.vercel.app${mainImage}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteImage,
    brand: {
      "@type": "Brand",
      name: "T-KAI",
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price:
        getActiveSalePrice(
          product.price,
          product.salePrice,
          product.saleEndsAt
        ) ?? product.price,
      availability: "https://schema.org/InStock",
      url: `https://tkai-shop.vercel.app/product/${product.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://tkai-shop.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Boutique",
        item: "https://tkai-shop.vercel.app/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: `https://tkai-shop.vercel.app/shop?category=${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://tkai-shop.vercel.app/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="mx-auto max-w-7xl px-4 py-7 text-white md:px-8 md:py-12">
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-zinc-500 transition hover:text-white md:mb-8"
        >
          <span aria-hidden="true">←</span> Retour à la collection
        </Link>
        <ProductDetailClient
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            saleEndsAt: product.saleEndsAt?.toISOString() ?? null,
            promoReferenceTime: Date.now(),
            description: product.description,
            categoryName: product.category.name,
          }}
          images={images}
          fallbackImage="/logo-tkai.jpeg"
          availableSizes={fallbackSizes}
        />
      </section>
    </>
  );
}
