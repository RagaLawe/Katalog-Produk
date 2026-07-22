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
    include: {
      ikm: { select: { id: true, name: true, slug: true, category: true } },
    },
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
    include: {
      ikm: { select: { id: true, name: true, slug: true, category: true } },
    },
  });

  // Fetch cross-category products (from OTHER categories, limit 3, random selection)
  const crossCategoryProducts = await db.product.findMany({
    where: {
      NOT: { category: product.category },
    },
    include: {
      ikm: { select: { id: true, name: true, slug: true, category: true } },
    },
  });

  // Shuffle and take 3
  const shuffled = crossCategoryProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Map a Prisma product (with ikm relation) to the shape expected by
  // ProductDetailContent / ProductCard (which still use `ikmName`).
  const mapProduct = (p: typeof product) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    description: p.description,
    specifications: p.specifications,
    artisanInfo: p.artisanInfo,
    ikmName: p.ikm?.name ?? null,
    whatsappNumber: p.whatsappNumber,
    marketplaceUrl: p.marketplaceUrl,
    imageUrl: p.imageUrl,
    isFeatured: p.isFeatured,
  });

  return (
    <ProductDetailContent
      product={mapProduct(product)}
      relatedProducts={relatedProducts.map(mapProduct)}
      crossCategoryProducts={shuffled.map(mapProduct)}
    />
  );
}
