interface ProductJsonLdProps {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  artisanInfo: string | null;
}

export default function ProductJsonLd({
  name,
  description,
  imageUrl,
  price,
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: 'Produk Unggulan Ngada',
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Dinas Perindag Kabupaten Ngada',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
