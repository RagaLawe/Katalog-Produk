export default function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Dinas Perdagangan dan Perindustrian Kabupaten Ngada',
    alternateName: 'Dinas Perindag Ngada',
    url: 'https://perindag.ngadakab.go.id',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Soekarno No. 1',
      addressLocality: 'Bajawa',
      addressRegion: 'NTT',
      addressCountry: 'ID',
    },
    telephone: '(0384) 21001',
    email: 'perindag@ngadakab.go.id',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
