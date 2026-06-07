'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.subject) {
      newErrors.subject = 'Subjek wajib dipilih';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Pesan wajib diisi';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Pesan minimal 10 karakter';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success('Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.');

    setFormData({
      fullName: '',
      email: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat',
      detail: 'Jl. Soekarno No. 1, Bajawa, Kabupaten Ngada, NTT 86412',
    },
    {
      icon: Phone,
      title: 'Telepon',
      detail: '(0384) 21012',
    },
    {
      icon: Mail,
      title: 'Email',
      detail: 'perindag@ngadakab.go.id',
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Hubungi Kami
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Punya pertanyaan? Kami siap membantu Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Contact Info - Left Side */}
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Informasi Kontak
            </h3>
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative divider for desktop */}
            <div className="hidden lg:block mt-8">
              <div className="tenun-border-top h-1" />
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="bg-card rounded-xl shadow-sm border border-border/50 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Subjek */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subjek</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleChange('subject', value)}
                >
                  <SelectTrigger
                    id="subject"
                    className={`w-full ${errors.subject ? 'border-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Pilih subjek" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pertanyaan Produk">
                      Pertanyaan Produk
                    </SelectItem>
                    <SelectItem value="Kerjasama">Kerjasama</SelectItem>
                    <SelectItem value="Pemesanan Grosir">
                      Pemesanan Grosir
                    </SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-destructive">{errors.subject}</p>
                )}
              </div>

              {/* Pesan */}
              <div className="space-y-2">
                <Label htmlFor="message">Pesan</Label>
                <Textarea
                  id="message"
                  placeholder="Tulis pesan Anda di sini..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className={errors.message ? 'border-destructive' : ''}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Mengirim...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Kirim Pesan
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
