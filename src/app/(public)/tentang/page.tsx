import { Mountain, Gem, Building2, Eye, MessageCircle, Package, Users, MapPin, Sparkles } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';

const stats = [
  { icon: Package, value: '3', label: 'Kategori Produk' },
  { icon: Users, value: '50+', label: 'Pengrajin Aktif' },
  { icon: MapPin, value: '10+', label: 'Desa Penghasil' },
  { icon: Sparkles, value: '1', label: 'Kabupaten, Banyak Potensi' },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="tenun-pattern w-full h-full" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Tentang Dinas Perindag Kabupaten Ngada
          </h1>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Mendorong pertumbuhan ekonomi lokal dan melestarikan kearifan budaya melalui pemberdayaan UMKM di Kabupaten Ngada, Nusa Tenggara Timur.
          </p>
        </div>
      </section>

      {/* Bumi Todo Ngada */}
      <section className="py-14 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Mountain className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Bumi Todo Ngada
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Kabupaten Ngada, yang terletak di jantung Pulau Flores, Nusa Tenggara Timur, dikenal dengan sebutan &ldquo;Bumi Todo Ngada&rdquo; — tanah yang kaya akan tradisi dan potensi alam. Dikelilingi oleh pegunungan vulkanik yang subur dan dataran tinggi yang sejuk, Ngada menyimpan kekayaan budaya yang telah diwariskan dari generasi ke generasi selama berabad-abad.
              </p>
              <p>
                Masyarakat Ngada hidup berdampingan dengan alam, menghormati tradisi leluhur, dan menjaga kearifan lokal yang menjadi identitas mereka. Dari puncak Gunung Inerie hingga lembah-lembah hijau yang menghampar, setiap sudut Ngada menyimpan cerita dan keindahan yang menunggu untuk ditemukan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tenun-border-top h-1" />
      </div>

      {/* Kekayaan Produk Lokal */}
      <section className="py-14 sm:py-16 bg-warm-cream-dark/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-accent/10">
                <Gem className="h-5 w-5 text-gold-accent" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Kekayaan Produk Lokal
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Ngada merupakan rumah bagi tiga produk unggulan yang telah dikenal luas: <strong className="text-foreground">Tenun Ikat</strong>, <strong className="text-foreground">Kopi Bajawa</strong>, dan <strong className="text-foreground">Kerajinan Bambu</strong>. Setiap produk membawa cerita, tradisi, dan keahlian yang tak tertandingi.
              </p>
              <p>
                Tenun Ikat Ngada ditenun oleh tangan-tangan terampil pengrajin perempuan dengan motif dan warna yang sarat makna filosofis. Kopi Bajawa tumbuh di ketinggian 1.200-1.600 meter di atas permukaan laut, menghasilkan cita rasa yang diakui dunia. Kerajinan bambu dibuat dengan teknik anyaman turun-temurun yang menghasilkan karya fungsional sekaligus artistik.
              </p>
              <p>
                Produk-produk ini bukan sekadar komoditas, melainkan representasi dari jiwa dan budaya masyarakat Ngada yang terus hidup dan berkembang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tenun-border-top h-1" />
      </div>

      {/* Peran Dinas Perindag */}
      <section className="py-14 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
                <Building2 className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Peran Dinas Perindag
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Dinas Perdagangan dan Perindustrian (Perindag) Kabupaten Ngada memiliki peran strategis dalam mengembangkan dan mempromosikan produk-produk unggulan daerah. Sebagai garda terdepan pemberdayaan UMKM, Dinas Perindag berkomitmen untuk:
              </p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Mengkurasi produk berkualitas</strong> — Memastikan setiap produk yang ditampilkan memenuhi standar kualitas yang tinggi dan merupakan produk asli Ngada.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Membuka akses pasar</strong> — Menghubungkan pengrajin lokal dengan pasar yang lebih luas melalui platform digital dan pameran dagang.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Membina pengrajin</strong> — Memberikan pelatihan, pendampingan, dan dukungan teknis kepada pengrajin untuk meningkatkan kualitas dan produktivitas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Melestarikan kearifan lokal</strong> — Menjaga tradisi dan teknik pembuatan produk yang telah menjadi warisan budaya tak benda.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tenun-border-top h-1" />
      </div>

      {/* Visi & Misi */}
      <section className="py-14 sm:py-16 bg-warm-cream-dark/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-bamboo-green/10">
                <Eye className="h-5 w-5 text-bamboo-green" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Visi &amp; Misi
              </h2>
            </div>

            {/* Visi */}
            <div className="mb-8 p-6 bg-card rounded-xl border border-border/50 shadow-sm">
              <h3 className="text-lg font-semibold text-primary mb-3">Visi</h3>
              <p className="text-muted-foreground leading-relaxed italic">
                &ldquo;Menjadi kabupaten dengan UMKM yang berdaya saing, produk unggulan yang mendunia, dan kearifan budaya yang terlestarikan demi kesejahteraan masyarakat Ngada.&rdquo;
              </p>
            </div>

            {/* Misi */}
            <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
              <h3 className="text-lg font-semibold text-primary mb-3">Misi</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Meningkatkan kapasitas dan kualitas produk UMKM melalui pelatihan dan pendampingan berkelanjutan.</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Memperluas jangkauan pemasaran produk lokal ke pasar nasional dan internasional.</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Melestarikan tradisi dan keahlian lokal sebagai warisan budaya yang bernilai ekonomi.</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Membangun ekosistem perdagangan yang inklusif dan berkelanjutan bagi seluruh pelaku usaha di Ngada.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-14 sm:py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="tenun-pattern w-full h-full" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10 mb-3">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-16 bg-warm-cream-dark/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Ingin Berkolaborasi?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Kami terbuka untuk kolaborasi dengan pihak mana pun yang ingin mendukung pengembangan produk unggulan Ngada. Hubungi kami melalui WhatsApp untuk memulai percakapan.
          </p>
          <WhatsAppButton
            productName="Kolaborasi Perindag Ngada"
            price="—"
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse"
          />
        </div>
      </section>
    </div>
  );
}
