import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ProductDetailContent from '@/components/ProductDetailContent';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category (max 4, excluding current product)
  const relatedProducts = await db.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ProductDetailContent
      product={product}
      relatedProducts={relatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        description: p.description,
        imageUrl: p.imageUrl,
        isFeatured: p.isFeatured,
      }))}
    />
  );
}
