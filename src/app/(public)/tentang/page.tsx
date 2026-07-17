import { Mountain, Gem, Building2, Eye } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import AboutStats from '@/components/AboutStats';
import ContactForm from '@/components/ContactForm';
import NewsletterSection from '@/components/NewsletterSection';
import SiteProfileSection from '@/components/SiteProfileSection';
import IKMListSection from '@/components/IKMListSection';

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-16 sm:py-24 bg-primary overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-sm font-medium text-white/50 uppercase tracking-widest mb-4">
            Dinas Perdagangan & Perindustrian
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
            Tentang Dinas Perindag<br className="hidden sm:block" /> Kabupaten Ngada
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Mendorong pertumbuhan ekonomi lokal dan melestarikan kearifan budaya melalui pemberdayaan UMKM di Kabupaten Ngada, Nusa Tenggara Timur.
          </p>
        </div>
      </section>

      {/* Profil Dinas Perindag (NTT-style structured profile) */}
      <SiteProfileSection />

      {/* Bumi Todo Ngada */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/5">
                <Mountain className="h-4.5 w-4.5 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Bumi Todo Ngada
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
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

      {/* Kekayaan Produk Lokal */}
      <section className="py-14 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold-accent/5">
                <Gem className="h-4.5 w-4.5 text-gold-accent" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Kekayaan Produk Lokal
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
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

      {/* Daftar IKM Mitra Kami */}
      <IKMListSection />

      {/* Peran Dinas Perindag */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary/5">
                <Building2 className="h-4.5 w-4.5 text-secondary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Peran Dinas Perindag
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                Dinas Perdagangan dan Perindustrian (Perindag) Kabupaten Ngada memiliki peran strategis dalam mengembangkan dan mempromosikan produk-produk unggulan daerah. Sebagai garda terdepan pemberdayaan UMKM, Dinas Perindag berkomitmen untuk:
              </p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Mengkurasi produk berkualitas</strong> — Memastikan setiap produk yang ditampilkan memenuhi standar kualitas yang tinggi dan merupakan produk asli Ngada.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Membuka akses pasar</strong> — Menghubungkan pengrajin lokal dengan pasar yang lebih luas melalui platform digital dan pameran dagang.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Membina pengrajin</strong> — Memberikan pelatihan, pendampingan, dan dukungan teknis kepada pengrajin untuk meningkatkan kualitas dan produktivitas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Melestarikan kearifan lokal</strong> — Menjaga tradisi dan teknik pembuatan produk yang telah menjadi warisan budaya tak benda.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-14 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-bamboo-green/5">
                <Eye className="h-4.5 w-4.5 text-bamboo-green" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Visi &amp; Misi
              </h2>
            </div>

            {/* Visi */}
            <div className="mb-6 p-6 bg-card rounded-xl border border-border/40">
              <h3 className="text-base font-semibold text-foreground mb-3">Visi</h3>
              <p className="text-muted-foreground leading-relaxed italic text-sm sm:text-base">
                &ldquo;Menjadi kabupaten dengan UMKM yang berdaya saing, produk unggulan yang mendunia, dan kearifan budaya yang terlestarikan demi kesejahteraan masyarakat Ngada.&rdquo;
              </p>
            </div>

            {/* Misi */}
            <div className="p-6 bg-card rounded-xl border border-border/40">
              <h3 className="text-base font-semibold text-foreground mb-3">Misi</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/5 text-primary text-xs font-semibold shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Meningkatkan kapasitas dan kualitas produk UMKM melalui pelatihan dan pendampingan berkelanjutan.</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/5 text-primary text-xs font-semibold shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Memperluas jangkauan pemasaran produk lokal ke pasar nasional dan internasional.</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/5 text-primary text-xs font-semibold shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Melestarikan tradisi dan keahlian lokal sebagai warisan budaya yang bernilai ekonomi.</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/5 text-primary text-xs font-semibold shrink-0 mt-0.5">
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
      <AboutStats />

      {/* Contact Form Section */}
      <ContactForm />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <section className="py-14 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            Ingin Berkolaborasi?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
            Kami terbuka untuk kolaborasi dengan pihak mana pun yang ingin mendukung pengembangan produk unggulan Ngada.
          </p>
          <WhatsAppButton
            productName="Kolaborasi Etalase IKM Ngada"
            price="—"
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
