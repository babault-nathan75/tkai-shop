import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 text-white md:py-14">
      <ProductDetailClient
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          description: product.description,
          categoryName: product.category.name,
        }}
        images={images}
        fallbackImage="/logo-tkai.jpeg"
        availableSizes={fallbackSizes}
      />
    </section>
  );
}
