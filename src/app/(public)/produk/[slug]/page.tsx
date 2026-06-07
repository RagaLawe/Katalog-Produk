import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, User } from 'lucide-react';
import { db } from '@/lib/db';
import CategoryBadge from '@/components/CategoryBadge';
import TrustBadge from '@/components/TrustBadge';
import PriceDisplay from '@/components/PriceDisplay';
import WhatsAppButton from '@/components/WhatsAppButton';

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

  const categoryLabel =
    product.category === 'tenun'
      ? 'Tenun Ikat'
      : product.category === 'kopi'
        ? 'Kopi Bajawa'
        : 'Kerajinan Bambu';

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-primary/5 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href="/katalog" className="hover:text-primary transition-colors">
                Katalog
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="text-foreground font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Product Detail */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-muted shadow-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap mb-4">
                <CategoryBadge category={product.category as 'tenun' | 'kopi' | 'bambu'} />
                <TrustBadge type="asli" />
                <TrustBadge type="dikurasi" />
              </div>

              {/* Product Name */}
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-5">
                <PriceDisplay price={product.price} className="text-2xl sm:text-3xl" />
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                  Deskripsi Produk
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Artisan Info */}
              {product.artisanInfo && (
                <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Cerita Pengrajin
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.artisanInfo}
                  </p>
                </div>
              )}

              {/* Category Info */}
              <div className="mb-6 p-4 bg-warm-cream-dark/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Kategori:</span>
                  <span className="text-sm font-medium text-foreground">{categoryLabel}</span>
                </div>
              </div>

              {/* WhatsApp CTA - Desktop */}
              <div className="hidden lg:block">
                <WhatsAppButton
                  productName={product.name}
                  price={new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA - Mobile (Sticky Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
        <WhatsAppButton
          productName={product.name}
          price={new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(product.price)}
          size="lg"
          className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse"
        />
      </div>

      {/* Spacer for mobile sticky button */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
