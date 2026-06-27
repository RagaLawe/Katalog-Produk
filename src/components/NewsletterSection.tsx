'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Alamat email wajib diisi');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Format email tidak valid');
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const existing = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      if (existing.includes(email)) {
        toast.info('Email ini sudah terdaftar berlangganan.');
        setIsSubmitting(false);
        return;
      }
      existing.push(email);
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(existing));
    } catch {
      localStorage.setItem('newsletter_subscriptions', JSON.stringify([email]));
    }

    toast.success('Terima kasih! Anda telah berlangganan.');
    setEmail('');
    setIsSubmitting(false);
  }, [email]);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 mb-4">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Dapatkan Info Terbaru
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
            Berlangganan untuk mendapatkan informasi produk unggulan dan kegiatan Dinas Perindag
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Alamat email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 pr-4 h-11 bg-muted/50 border-border/40 rounded-lg"
                aria-label="Alamat email"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-5 gap-2 shrink-0 rounded-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4 animate-pulse" />
                </span>
              ) : (
                <>
                  Kirim
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-3">
            Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
