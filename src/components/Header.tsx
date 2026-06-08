'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/tentang', label: 'Tentang' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Fixed header - never moves */}
      <header
        className={cn(
          'tenun-border-top fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,box-shadow] duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-lg shadow-md'
            : 'bg-background backdrop-blur-sm'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary leading-tight">
                Perindag
              </span>
              <span className="text-xs text-secondary leading-tight -mt-0.5">
                Kabupaten Ngada
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-primary rounded-full" />
                )}
              </Link>
            ))}
            <div className="w-px h-5 bg-border/50 mx-1" />
            <ThemeToggle />
            <Link
              href="/admin"
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 text-foreground/60 hover:text-primary hover:bg-primary/5 border border-border/40 hover:border-primary/30 hover:shadow-sm"
              title="Login Admin"
            >
              <LogIn className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile: Theme toggle + Menu button */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Buka menu navigasi</span>
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-primary font-bold">Perindag Ngada</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 mt-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        isActive(link.href)
                          ? 'text-primary bg-primary/10 border-l-2 border-primary'
                          : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-foreground/70 hover:text-primary hover:bg-primary/5 hover:shadow-sm border border-border/40"
                      onClick={() => setOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login Admin</span>
                    </Link>
                  </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from going behind the fixed header */}
      <div className="h-16" />
    </>
  );
}
