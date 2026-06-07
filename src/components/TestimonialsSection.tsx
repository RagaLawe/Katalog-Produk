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
    text: 'Teknik anyaman bambu kami sudah turun-temurun tujuh generasi. Dulu kami hanya menjual di pasar lokal, sekarang produk kami sudah sampai ke Jakarta dan bahkan luar negeri. Dinas Perindag membantu kami berkembang.',
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

const categoryBorderColors: Record<string, string> = {
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

  // Subscribe to carousel events (same pattern as ProductDetailContent)
  if (api) {
    api.on('select', onSelect);
  }

  // Auto-scroll every 5 seconds
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
    <section className="py-16 sm:py-20 bg-warm-cream-dark/30 tenun-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Kata Pengrajin Kami
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Cerita langsung dari para pengrajin produk unggulan Ngada
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                    className={`bg-background rounded-xl shadow-sm border border-border/50 border-l-4 ${categoryBorderColors[testimonial.category]} p-6 relative h-full`}
                  >
                    {/* Quote icon */}
                    <Quote className="absolute top-4 right-4 h-8 w-8 text-muted-foreground/15" />

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-gold-accent text-gold-accent"
                        />
                      ))}
                    </div>

                    {/* Testimonial text */}
                    <p className="text-muted-foreground italic leading-relaxed mb-4 text-sm sm:text-base">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {/* Author info */}
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
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

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-10"
              onClick={() => api?.scrollPrev()}
              aria-label="Testimoni sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'w-8 bg-primary'
                      : 'w-2.5 bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-10"
              onClick={() => api?.scrollNext()}
              aria-label="Testimoni berikutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
