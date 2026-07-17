'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Clock,
  History,
  User,
  Eye,
  Target,
  Briefcase,
  Quote,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { Skeleton } from '@/components/ui/skeleton';

interface SiteProfile {
  officeName: string | null;
  address: string | null;
  history: string | null;
  leaderName: string | null;
  leaderPosition: string | null;
  leaderPhoto: string | null;
  vision: string | null;
  mission: string | null;
  duties: string | null;
  functions: string | null;
  email: string | null;
  phone: string | null;
  workingHours: string | null;
  mapEmbed: string | null;
}

function splitLines(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function splitParagraphs(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function extractMapSrc(embed: string): string | null {
  if (!embed) return null;
  const trimmed = embed.trim();
  // If user pasted a full <iframe ...> snippet, extract the src attribute.
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  if (match && match[1]) return match[1];
  // Otherwise treat the raw string as the URL itself (must start with http).
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
}

function SectionTitle({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/5">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">{label}</h2>
    </div>
  );
}

export default function SiteProfileSection() {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        setIsLoading(true);
        setHasError(false);
        const res = await fetch('/api/profil');
        if (!res.ok) throw new Error('Gagal memuat profil');
        const data: SiteProfile = await res.json();
        if (cancelled) return;
        setProfile(data);
      } catch {
        if (cancelled) return;
        setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-8 w-48 mt-4" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-8 w-56 mt-4" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </section>
    );
  }

  if (hasError || !profile) {
    return (
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            Profil dinas sedang tidak dapat ditampilkan. Silakan coba beberapa
            saat lagi.
          </p>
        </div>
      </section>
    );
  }

  const missionItems = splitLines(profile.mission);
  const dutyItems = splitLines(profile.duties);
  const functionItems = splitLines(profile.functions);
  const historyParagraphs = splitParagraphs(profile.history);
  const mapSrc = extractMapSrc(profile.mapEmbed);

  return (
    <section className="py-14 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-16">
        {/* A. Nama & Alamat Kantor */}
        <ScrollReveal>
          <SectionTitle label="A. Nama dan Alamat Kantor" icon={Building2} />
          <div className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-5">
              {profile.officeName || 'Dinas Perdagangan dan Perindustrian Kabupaten Ngada'}
            </h3>
            <ul className="space-y-4 text-sm sm:text-base">
              {profile.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.address}
                  </span>
                </li>
              )}
              {profile.email && (
                <li className="flex items-start gap-3">
                  <Mail className="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
                  <a
                    href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {profile.phone}
                  </a>
                </li>
              )}
              {profile.workingHours && (
                <li className="flex items-start gap-3">
                  <Clock className="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">
                    {profile.workingHours}
                  </span>
                </li>
              )}
            </ul>

            {mapSrc && (
              <div className="mt-6 overflow-hidden rounded-lg border border-border/40">
                <iframe
                  src={mapSrc}
                  title="Lokasi Kantor Dinas Perindag Kabupaten Ngada"
                  width="100%"
                  height="280"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0, display: 'block' }}
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* B. Sejarah Singkat */}
        <ScrollReveal>
          <SectionTitle label="B. Sejarah Singkat" icon={History} />
          <div className="bg-muted/30 rounded-xl p-6 sm:p-8 border border-border/40">
            {historyParagraphs.length > 0 ? (
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                {historyParagraphs.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Sejarah dinas akan diperbarui segera.
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* C. Profil Pimpinan */}
        <ScrollReveal>
          <SectionTitle label="C. Profil Pimpinan" icon={User} />
          <div className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 shadow-sm">
            {profile.leaderName ? (
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {profile.leaderPhoto && (
                  <div className="shrink-0">
                    <img
                      src={profile.leaderPhoto}
                      alt={profile.leaderName}
                      className="w-24 h-24 rounded-full object-cover border border-border/60 shadow-sm"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">
                    {profile.leaderName}
                  </h3>
                  {profile.leaderPosition && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.leaderPosition}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Profil pimpinan akan diperbarui segera.
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* D. Visi & Misi */}
        <ScrollReveal>
          <SectionTitle label="D. Visi & Misi" icon={Eye} />
          <div className="space-y-5">
            {/* Visi */}
            <div className="bg-muted/30 rounded-xl p-6 sm:p-8 border border-border/40 relative">
              <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/15" />
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Visi
              </h3>
              {profile.vision ? (
                <p className="text-muted-foreground leading-relaxed italic text-sm sm:text-base">
                  &ldquo;{profile.vision}&rdquo;
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Visi akan diperbarui segera.
                </p>
              )}
            </div>

            {/* Misi */}
            <div className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Misi
              </h3>
              {missionItems.length > 0 ? (
                <ol className="space-y-3">
                  {missionItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/5 text-primary text-xs font-semibold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed whitespace-pre-line">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Misi akan diperbarui segera.
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* E. Tugas & Fungsi */}
        <ScrollReveal>
          <SectionTitle label="E. Tugas & Fungsi" icon={Briefcase} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tugas */}
            <div className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Tugas
              </h3>
              {dutyItems.length > 0 ? (
                <ul className="space-y-3">
                  {dutyItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="leading-relaxed whitespace-pre-line">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Tugas akan diperbarui segera.
                </p>
              )}
            </div>

            {/* Fungsi */}
            <div className="bg-muted/30 rounded-xl p-6 sm:p-8 border border-border/40">
              <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Fungsi
              </h3>
              {functionItems.length > 0 ? (
                <ul className="space-y-3">
                  {functionItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="leading-relaxed whitespace-pre-line">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Fungsi akan diperbarui segera.
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
