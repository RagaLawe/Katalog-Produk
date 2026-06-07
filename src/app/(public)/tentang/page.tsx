import { Mountain, Gem, Building2, Eye } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import AboutStats from '@/components/AboutStats';
import ContactForm from '@/components/ContactForm';
import ScrollReveal from '@/components/ScrollReveal';
import NewsletterSection from '@/components/NewsletterSection';

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
        {/* Tenun pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="tenun-pattern w-full h-full" />
        </div>

        {/* Decorative shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large circle - top right */}
          <svg className="absolute -top-24 -right-24 w-80 h-80 text-white/[0.05]" viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="100" />
          </svg>
          {/* Medium circle - bottom left */}
          <svg className="absolute -bottom-16 -left-16 w-56 h-56 text-gold-accent/[0.08]" viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="100" />
          </svg>
          {/* Diamond pattern - left */}
          <svg className="absolute top-[20%] left-[8%] w-16 h-16 text-white/[0.06]" viewBox="0 0 80 80" fill="currentColor">
            <path d="M40 0L80 40L40 80L0 40Z" />
          </svg>
          {/* Dot cluster - right */}
          <svg className="absolute top-[60%] right-[12%] w-12 h-12 text-white/[0.06]" viewBox="0 0 60 60" fill="currentColor">
            <circle cx="10" cy="10" r="3" />
            <circle cx="30" cy="10" r="3" />
            <circle cx="50" cy="10" r="3" />
            <circle cx="20" cy="30" r="3" />
            <circle cx="40" cy="30" r="3" />
            <circle cx="10" cy="50" r="3" />
            <circle cx="30" cy="50" r="3" />
            <circle cx="50" cy="50" r="3" />
          </svg>
          {/* Decorative wave at bottom */}
          <svg className="absolute bottom-0 left-0 right-0 w-full h-16 text-warm-cream-dark/50" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="currentColor" />
          </svg>
          {/* Horizontal line accent */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-accent/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Decorative icon above title */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/20">
            <svg className="w-7 h-7 text-gold-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 21h18M3 21V8l9-5 9 5v13M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            Tentang Dinas Perindag<br className="hidden sm:block" /> Kabupaten Ngada
          </h1>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Mendorong pertumbuhan ekonomi lokal dan melestarikan kearifan budaya melalui pemberdayaan UMKM di Kabupaten Ngada, Nusa Tenggara Timur.
          </p>
          {/* Decorative gold accent line below subtitle */}
          <div className="mt-6 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-gold-accent via-gold-accent/60 to-transparent" />
        </div>
      </section>

      {/* Bumi Todo Ngada */}
      <ScrollReveal direction="left">
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
      </ScrollReveal>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tenun-border-top h-1" />
      </div>

      {/* Kekayaan Produk Lokal */}
      <ScrollReveal direction="right">
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
      </ScrollReveal>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tenun-border-top h-1" />
      </div>

      {/* Peran Dinas Perindag */}
      <ScrollReveal direction="left">
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
      </ScrollReveal>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tenun-border-top h-1" />
      </div>

      {/* Visi & Misi */}
      <ScrollReveal direction="right">
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
      </ScrollReveal>

      {/* Statistics Section */}
      <AboutStats />

      {/* Contact Form Section */}
      <ContactForm />

      {/* Newsletter Section */}
      <NewsletterSection />

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
