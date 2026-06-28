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

  // Default WhatsApp number for all products (admin pusat)
  const defaultWa = '6281313620658';

  // Sample products with IKM info, WhatsApp number, and marketplace link
  const products = [
    // Tenun Ikat Products
    {
      name: 'Selendang Tenun Ikat Ngada',
      slug: 'selendang-tenun-ikat-ngada',
      category: 'tenun',
      price: 450000,
      description: 'Selendang tenun ikat khas Ngada dengan motif tradisional yang ditenun secara tangan oleh pengrajin lokal. Kain ini memiliki corak geometris khas Flores yang melambangkan keharmonisan alam dan kehidupan. Setiap helai benang ditenun dengan penuh kesabaran dan ketelitian, menghasilkan karya seni yang tak ternilai harganya. Cocok untuk acara adat, pesta, atau koleksi fashion tradisional.',
      ikmName: 'IKM Sari Tenun Wolojita',
      artisanInfo: 'IKM Sari Tenun Wolojita adalah kelompok pengrajin tenun ikat yang berbasis di Desa Wolojita, Kecamatan Jerebuu, Kabupaten Ngada. Dikoordinir oleh Ibu Maria Gele, IKM ini beranggotakan 15 perempuan pengrajin yang telah melestarikan tradisi tenun ikat turun-temurun selama tiga generasi.\n\nSetiap kain ditenun secara manual menggunakan alat tenun bukan mesin (ATBM) dengan benang katun berkualitas tinggi. Proses pewarnaan masih menggunakan pewarna alami dari akar, kulit pohon, dan daun tanaman lokal. IKM ini telah berpartisipasi dalam berbagai pameran produk lokal dan nasional.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
      imageUrl: '/images/products/tenun-selendang.png',
      isFeatured: true,
    },
    {
      name: 'Sarung Tenun Ikat Bajawa',
      slug: 'sarung-tenun-ikat-bajawa',
      category: 'tenun',
      price: 750000,
      description: 'Sarung tenun ikat premium dari Bajawa dengan motif yang kaya akan makna filosofis. Proses pembuatan memakan waktu hingga 2 bulan, mulai dari pencelupan benang hingga penenunan. Warna merah tua dan hitam yang dominan mencerminkan keberanian dan kekuatan budaya Ngada. Sarung ini merupakan simbol kehormatan dan sering digunakan dalam upacara adat penting.',
      ikmName: 'IKM Tenun Langa Makmur',
      artisanInfo: 'IKM Tenun Langa Makmur berlokasi di Desa Langa, Kecamatan Bajawa. Dipimpin oleh Ibu Theresia Woe, kelompok ini telah berdiri sejak 2005 dan memiliki 22 anggota.\n\nTenun ikat Bajawa dikenal dengan motif filosofis yang kaya, di mana setiap pola memiliki makna tersendiri terkait kehidupan, alam, dan leluhur. Proses pembuatan satu sarung tenun premium memakan waktu 1-2 bulan, mulai dari pencelupan benang hingga finishing.\n\nIKM ini juga aktif melatih generasi muda untuk menjaga keberlanjutan tradisi tenun.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
      imageUrl: '/images/products/tenun-sarung.png',
      isFeatured: true,
    },
    {
      name: 'Modo Tenun Ikat Ngada',
      slug: 'modo-tenun-ikat-ngada',
      category: 'tenun',
      price: 350000,
      description: 'Modo atau kain selendang tradisional Ngada dengan motif sederhana namun elegan. Ditenun menggunakan benang katun berkualitas tinggi dengan teknik ikat yang telah diwariskan turun-temurun. Cocok untuk penggunaan sehari-hari maupun sebagai oleh-oleh khas Ngada yang berkesan.',
      ikmName: 'IKM Benteng Tengah Tenun',
      artisanInfo: 'IKM Benteng Tengah Tenun merupakan kelompok pengrajin yang berada di Desa Benteng Tengah, Kecamatan Bajawa. Dikelola oleh Ibu Yuliana Boa, IKM ini fokus pada produksi modo dan kain tenun untuk penggunaan sehari-hari maupun souvenir.\n\nDengan 12 anggota, IKM ini memproduksi kain tenun dengan motif yang lebih sederhana namun tetap elegan, sehingga harga lebih terjangkau untuk wisatawan yang berkunjung ke Ngada.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
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
      ikmName: 'Kelompok Tani Kopi Mbero',
      artisanInfo: 'Kelompok Tani Kopi Mbero berlokasi di Desa Mbero, Kecamatan Bajawa, pada ketinggian 1.200-1.400 mdpl. Dipimpin oleh Pak Yohanes Bhe, kelompok ini memiliki 35 anggota petani kopi arabika.\n\nLahan perkebunan dikelola secara organik tanpa pestisida kimia. Proses pengolahan menggunakan metode wet processing (giling basah) untuk menghasilkan biji kopi berkualitas tinggi.\n\nKelompok ini telah memperoleh sertifikasi organik dan menjadi pemasok kopi specialty untuk beberapa coffee shop di Jakarta dan Bali.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
      imageUrl: '/images/products/kopi-bajawa-premium.png',
      isFeatured: true,
    },
    {
      name: 'Kopi Robusta Bajawa Bubuk',
      slug: 'kopi-robusta-bajawa-bubuk',
      category: 'kopi',
      price: 50000,
      description: 'Kopi Robusta Bajawa dalam bentuk bubuk siap seduh. Memiliki body yang tebal dan rasa yang bold dengan sentuhan cokelat dan rempah. Cocok untuk pecinta kopi dengan rasa yang kuat dan penuh karakter. Diproses secara tradisional dan disangrai dengan tingkat medium-dark untuk menghasilkan cita rasa yang khas.',
      ikmName: 'Kelompok Tani Kopi Wologopa',
      artisanInfo: 'Kelompok Tani Kopi Wologopa berbasis di Desa Wologopa, Kecamatan Golewa. Kelompok ini dikoordinir oleh Petrus Wae dan memiliki 28 anggota petani kopi robusta.\n\nKopi robusta dari Wologopa ditanam pada ketinggian 700-900 mdpl, menghasilkan biji dengan body tebal dan rasa yang bold. Kelompok ini mengelola proses dari panen hingga penggilingan dan pengemasan secara mandiri, dengan kapasitas produksi 2-3 ton per bulan.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
      imageUrl: '/images/products/kopi-bajawa-bubuk.png',
      isFeatured: false,
    },
    {
      name: 'Kopi Liberika Bajawa Spesial',
      slug: 'kopi-liberika-bajawa-spesial',
      category: 'kopi',
      price: 95000,
      description: 'Kopi Liberika langka dari Bajawa, salah satu varietas kopi yang jarang ditemui. Memiliki profil rasa yang unik dengan aroma yang kompleks dan rasa yang smooth. Biji kopi Liberika berukuran lebih besar dari Arabika dan Robusta, memberikan pengalaman minum kopi yang berbeda. Sangrai light-medium untuk mempertahankan karakter asli biji.',
      ikmName: 'IKM Kopi Manulalu',
      artisanInfo: 'IKM Kopi Manulalu dipimpin oleh Pak Yohanes Bhe di Desa Manulalu, Kecamatan Bajawa. IKM ini fokus pada pengembangan varietas kopi Liberika yang langka dan jarang dibudidayakan.\n\nDengan 8 anggota, IKM ini mengelola kebun seluas 12 hektar dan menjadi salah satu produsen kopi Liberika terbesar di Flores. Biji Liberika berukuran lebih besar dari Arabika dan Robusta, dengan profil rasa yang unik.\n\nIKM ini juga aktif melakukan edukasi tentang kopi Liberika kepada konsumen dan pelaku kopi nasional.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
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
      ikmName: 'IKM Bambu Ratogesa',
      artisanInfo: 'IKM Bambu Ratogesa berlokasi di Desa Ratogesa, Kecamatan Golewa. Dipimpin oleh Bapak Dominikus Eko, IKM ini beranggotakan 10 pengrajin bambu yang ahli dalam teknik anyaman tradisional.\n\nBambu yang digunakan dipilih dari jenis bambu betung dan bambu apus yang berkualitas tinggi, ditebang pada musim yang tepat untuk memastikan keawetan. Setiap keranjang dikerjakan secara manual selama 2-3 hari.\n\nIKM ini juga memproduksi berbagai produk bambu lain seperti tas, tempat buah, dan dekorasi dinding.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
      imageUrl: '/images/products/bambu-keranjang.png',
      isFeatured: true,
    },
    {
      name: 'Pendon Bambu Dekoratif Ngada',
      slug: 'pendon-bambu-dekoratif-ngada',
      category: 'bambu',
      price: 85000,
      description: 'Pendon atau dinding dekoratif dari bambu dengan motif khas Ngada. Dibuat menggunakan teknik anyaman yang menghasilkan pola geometris yang indah dan unik. Cocok untuk memperindah dinding rumah, restoran, atau hotel berkonsep tradisional. Setiap helai bambu diwarnai secara alami menggunakan pewarna tradisional.',
      ikmName: 'IKM Bambu Boba',
      artisanInfo: 'IKM Bambu Boba berbasis di Desa Boba, Kecamatan Jerebuu. Dikelola oleh Bapak Yohanes Bhe, IKM ini memiliki 8 anggota yang mengkhususkan diri pada pembuatan pendon dan dekorasi dinding dari bambu.\n\nTeknik anyaman yang digunakan menghasilkan pola geometris khas Ngada. Pewarnaan bambu dilakukan secara alami menggunakan kunyit, indigo, dan biji pinang.\n\nIKM ini telah memasok produk dekorasi bambu untuk beberapa hotel dan restoran di Flores dan Bali.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
      imageUrl: '/images/products/bambu-pendon.png',
      isFeatured: false,
    },
    {
      name: 'Kukusan Bambu Tradisional',
      slug: 'kukusan-bambu-tradisional',
      category: 'bambu',
      price: 65000,
      description: 'Kukusan nasi dari bambu tradisional yang masih digunakan oleh masyarakat Ngada untuk memasak nasi dalam upacara adat. Bambu yang digunakan dipilih dari jenis bambu apus yang tahan panas dan aman untuk makanan. Proses pembuatan dilakukan secara manual tanpa menggunakan mesin, menjaga keaslian dan kualitas produk.',
      ikmName: 'IKM Bambu Wolojita',
      artisanInfo: 'IKM Bambu Wolojita terletak di Desa Wolojita, Kecamatan Jerebuu. Dipimpin oleh Bapak Stefanus Boa, IKM ini beranggotakan 6 pengrajin yang memproduksi peralatan dapur tradisional dari bambu, khususnya kukusan nasi (supu).\n\nBambu apus yang digunakan dipilih karena tahan panas dan aman untuk kontak langsung dengan makanan. Setiap kukusan dibuat dengan teknik tanpa paku, hanya mengandalkan ikatan dan anyaman bambu.\n\nProduk IKM ini banyak digunakan oleh masyarakat lokal untuk upacara adat dan kini juga diminati oleh restoran tradisional.',
      whatsappNumber: defaultWa,
      marketplaceUrl: null,
      imageUrl: '/images/products/bambu-kukusan.png',
      isFeatured: false,
    },
  ];

  // Use upsert so existing products get updated with new fields (ikmName, whatsappNumber, etc.)
  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: product,
    });
    console.log(`✅ Upserted product: ${product.name}`);
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
