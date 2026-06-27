'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui/carousel';
import CategoryBadge from '@/components/CategoryBadge';

const testimonials = [
  {
    name: 'Mama Yuliana',
    role: 'Penenun Tenun Ikat',
    category: 'tenun' as const,
    text: 'Tenun ikat adalah warisan dari nenek moyang kami. Setiap motif menceritakan kisah tentang hubungan manusia dengan alam dan leluhur. Dengan bantuan Dinas Perindag, karya kami kini dikenal hingga ke luar daerah.',
    rating: 5,
  },
  {
    name: 'Pak Dominikus',
    role: 'Petani Kopi Bajawa',
    category: 'kopi' as const,
    text: 'Kopi Bajawa tumbuh di ketinggian 1.500 meter, dikelilingi oleh gunung-gunung vulkanik. Cita rasa khas kami tidak bisa ditiru. Terima kasih kepada Dinas Perindag yang membantu membuka akses pasar yang lebih luas.',
    rating: 5,
  },
  {
    name: 'Ibu Marta',
    role: 'Pengrajin Bambu',
    category: 'bambu' as const,
    text: 'Teknik anyaman bambu kami sudah turun-temurun tujuh generasi. Dulu kami hanya menjual di pasar lokal, sekarang produk kami sudah sampai ke Jakarta dan bahkan luar negeri.',
    rating: 5,
  },
  {
    name: 'Mama Sefrina',
    role: 'Penenun Tenun Ikat',
    category: 'tenun' as const,
    text: 'Menenun bukan sekadar pekerjaan, itu adalah doa dan meditasi. Setiap benang yang kita suspun mengandung harapan untuk anak cucu kita. Katalog ini membantu dunia mengenal keindahan karya kami.',
    rating: 5,
  },
  {
    name: 'Pak Yohanes',
    role: 'Petani Kopi Bajawa',
    category: 'kopi' as const,
    text: 'Kami bangga dengan kopi kami. Rasa yang kompleks dengan sentuhan cokelat dan rempah adalah khas tanah Ngada. Dinas Perindag membantu kami mendapatkan sertifikasi dan membuka peluang ekspor.',
    rating: 5,
  },
];

const categoryColors: Record<string, string> = {
  tenun: 'border-l-primary',
  kopi: 'border-l-secondary',
  bambu: 'border-l-bamboo-green',
};

export default function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setCount(api.scrollSnapList().length);
  }, [api]);

  if (api) {
    api.on('select', onSelect);
  }

  useEffect(() => {
    if (!api) return;
    autoScrollRef.current = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [api]);

  return (
    <section className="py-16 sm:py-24 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Kata Pengrajin Kami
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Cerita langsung dari para pengrajin produk unggulan Ngada
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative"
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full md:basis-1/2"
                >
                  <div
                    className={`bg-card rounded-xl border border-border/40 border-l-2 ${categoryColors[testimonial.category]} p-6 relative h-full`}
                  >
                    <Quote className="absolute top-4 right-4 h-6 w-6 text-muted-foreground/10" />

                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-gold-accent text-gold-accent"
                        />
                      ))}
                    </div>

                    <p className="text-muted-foreground italic leading-relaxed mb-4 text-sm">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                      <CategoryBadge category={testimonial.category} />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-9"
              onClick={() => api?.scrollPrev()}
              aria-label="Testimoni sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-muted-foreground/20'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-9"
              onClick={() => api?.scrollNext()}
              aria-label="Testimoni berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
