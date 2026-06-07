import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('perindag2024', 10);
  
  const existingAdmin = await db.admin.findFirst();
  if (!existingAdmin) {
    await db.admin.create({
      data: {
        email: 'admin@perindag-ngada.go.id',
        password: hashedPassword,
        name: 'Admin Perindag Ngada',
      },
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // Sample products
  const products = [
    // Tenun Ikat Products
    {
      name: 'Selendang Tenun Ikat Ngada',
      slug: 'selendang-tenun-ikat-ngada',
      category: 'tenun',
      price: 450000,
      description: 'Selendang tenun ikat khas Ngada dengan motif tradisional yang ditenun secara手工 oleh pengrajin lokal. Kain ini memiliki corak geometris khas Flores yang melambangkan keharmonisan alam dan kehidupan. Setiap helai benang ditenun dengan penuh kesabaran dan ketelitian, menghasilkan karya seni yang tak ternilai harganya. Cocok untuk acara adat, pesta, atau koleksi fashion tradisional.',
      artisanInfo: 'Dibuat oleh Ibu Maria Gele dari Desa Wolojita, Kecamatan Jerebuu',
      imageUrl: '/images/products/tenun-selendang.png',
      isFeatured: true,
    },
    {
      name: 'Sarung Tenun Ikat Bajawa',
      slug: 'sarung-tenun-ikat-bajawa',
      category: 'tenun',
      price: 750000,
      description: 'Sarung tenun ikat premium dari Bajawa dengan motif yang kaya akan makna filosofis. Proses pembuatan memakan waktu hingga 2 bulan, mulai dari pencelupan benang hingga penenunan. Warna merah tua dan hitam yang dominan mencerminkan keberanian dan kekuatan budaya Ngada. Sarung ini merupakan simbol kehormatan dan sering digunakan dalam upacara adat penting.',
      artisanInfo: 'Dibuat oleh Ibu Theresia Woe dari Desa Langa, Kecamatan Bajawa',
      imageUrl: '/images/products/tenun-sarung.png',
      isFeatured: true,
    },
    {
      name: 'Modo Tenun Ikat Ngada',
      slug: 'modo-tenun-ikat-ngada',
      category: 'tenun',
      price: 350000,
      description: 'Modo atau kain selendang tradisional Ngada dengan motif sederhana namun elegan. Ditenun menggunakan benang katun berkualitas tinggi dengan teknik ikat yang telah diwariskan turun-temurun. Cocok untuk penggunaan sehari-hari maupun sebagai oleh-oleh khas Ngada yang berkesan.',
      artisanInfo: 'Dibuat oleh Ibu Yuliana Boa dari Desa Benteng Tengah, Kecamatan Bajawa',
      imageUrl: '/images/products/tenun-modo.png',
      isFeatured: false,
    },

    // Kopi Bajawa Products
    {
      name: 'Kopi Arabika Bajawa Premium',
      slug: 'kopi-arabika-bajawa-premium',
      category: 'kopi',
      price: 75000,
      description: 'Kopi Arabika premium dari dataran tinggi Bajawa, Ngada. Ditanam pada ketinggian 1.200-1.600 mdpl, kopi ini memiliki cita rasa unik dengan sentuhan rasa fruity dan aroma floral yang khas. Proses pengolahan menggunakan metode wet processing untuk menghasilkan biji kopi berkualitas tinggi. Sangrai medium untuk memaksimalkan cita rasa asli biji kopi Bajawa.',
      artisanInfo: 'Diproduksi oleh Kelompok Tani Kopi Mbero, Desa Mbero, Kecamatan Bajawa',
      imageUrl: '/images/products/kopi-bajawa-premium.png',
      isFeatured: true,
    },
    {
      name: 'Kopi Robusta Bajawa Bubuk',
      slug: 'kopi-robusta-bajawa-bubuk',
      category: 'kopi',
      price: 50000,
      description: 'Kopi Robusta Bajawa dalam bentuk bubuk siap seduh. Memiliki body yang tebal dan rasa yang bold dengan sentuhan cokelat dan rempah. Cocok untuk pecinta kopi dengan rasa yang kuat dan penuh karakter. Diproses secara tradisional dan disangrai dengan tingkat medium-dark untuk menghasilkan cita rasa yang khas.',
      artisanInfo: 'Diproduksi oleh Kelompok Tani Kopi Wologopa, Desa Wologopa, Kecamatan Golewa',
      imageUrl: '/images/products/kopi-bajawa-bubuk.png',
      isFeatured: false,
    },
    {
      name: 'Kopi Liberika Bajawa Spesial',
      slug: 'kopi-liberika-bajawa-spesial',
      category: 'kopi',
      price: 95000,
      description: 'Kopi Liberika langka dari Bajawa, salah satu varietas kopi yang jarang ditemui. Memiliki profil rasa yang unik dengan aroma yang kompleks dan rasa yang smooth. Biji kopi Liberika berukuran lebih besar dari Arabika dan Robusta, memberikan pengalaman minum kopi yang berbeda. Sangrai light-medium untuk mempertahankan karakter asli biji.',
      artisanInfo: 'Diproduksi oleh Pak Yohanes Bhe dari Desa Manulalu, Kecamatan Bajawa',
      imageUrl: '/images/products/kopi-bajawa-liberika.png',
      isFeatured: true,
    },

    // Kerajinan Bambu Products
    {
      name: 'Keranjang Bambu Woven Ngada',
      slug: 'keranjang-bambu-woven-ngada',
      category: 'bambu',
      price: 120000,
      description: 'Keranjang anyaman bambu khas Ngada yang dibuat dengan teknik anyaman tradisional. Setiap keranjang dikerjakan oleh pengrajin berpengalaman yang menguasai teknik anyaman turun-temurun. Bambu yang digunakan dipilih secara selektif dari bambu berkualitas terbaik. Cocok untuk dekorasi rumah, wadah buah, atau sebagai hadiah souvenir khas Ngada.',
      artisanInfo: 'Dibuat oleh Bapak Dominikus Eko dari Desa Ratogesa, Kecamatan Golewa',
      imageUrl: '/images/products/bambu-keranjang.png',
      isFeatured: true,
    },
    {
      name: 'Pendon Bambu Dekoratif Ngada',
      slug: 'pendon-bambu-dekoratif-ngada',
      category: 'bambu',
      price: 85000,
      description: 'Pendon atau dinding dekoratif dari bambu dengan motif khas Ngada. Dibuat menggunakan teknik anyaman yang menghasilkan pola geometris yang indah dan unik. Cocok untuk memperindah dinding rumah, restoran, atau hotel berkonsep tradisional. Setiap helai bambu diwarnai secara alami menggunakan pewarna tradisional.',
      artisanInfo: 'Dibuat oleh Bapak Yohanes Bhe dari Desa Boba, Kecamatan Jerebuu',
      imageUrl: '/images/products/bambu-pendon.png',
      isFeatured: false,
    },
    {
      name: 'Kukusan Bambu Tradisional',
      slug: 'kukusan-bambu-tradisional',
      category: 'bambu',
      price: 65000,
      description: 'Kukusan nasi dari bambu tradisional yang masih digunakan oleh masyarakat Ngada untuk memasak nasi dalam upacara adat. Bambu yang digunakan dipilih dari jenis bambu apus yang tahan panas dan aman untuk makanan. Proses pembuatan dilakukan secara手工 tanpa menggunakan mesin, menjaga keaslian dan kualitas produk.',
      artisanInfo: 'Dibuat oleh Bapak Stefanus Boa dari Desa Wolojita, Kecamatan Jerebuu',
      imageUrl: '/images/products/bambu-kukusan.png',
      isFeatured: false,
    },
  ];

  for (const product of products) {
    const existing = await db.product.findUnique({
      where: { slug: product.slug },
    });
    if (!existing) {
      await db.product.create({ data: product });
      console.log(`✅ Created product: ${product.name}`);
    } else {
      console.log(`ℹ️ Product already exists: ${product.name}`);
    }
  }

  console.log('🎉 Seeding completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
