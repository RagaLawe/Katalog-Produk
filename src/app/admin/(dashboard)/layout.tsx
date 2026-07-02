'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  LayoutDashboard,
  Package,
  Building2,
  LogOut,
  Menu,
  X,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useAdminAuth } from '@/lib/admin-auth';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/dashboard/produk',
    label: 'Kelola Produk',
    icon: Package,
  },
  {
    href: '/admin/dashboard/profil',
    label: 'Profil Dinas',
    icon: Building2,
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, admin } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin');
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 group"
          onClick={onNavigate}
        >
          <Shield className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary leading-tight">
              Perindag
            </span>
            <span className="text-xs text-secondary leading-tight -mt-0.5">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Website */}
      <div className="px-3 pb-2">
        <Separator className="mb-3" />
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Website
        </Link>
      </div>

      {/* User section */}
      <div className="p-3 border-t">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-foreground truncate">
            {admin?.name || admin?.email || 'Admin'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {admin?.email || ''}
          </p>
        </div>
        <Separator className="mb-2" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated, isLoading, verify } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    verify();
  }, [verify]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-background border-r">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu Navigasi</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar for mobile */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">Perindag Admin</span>
          </div>
          <Link
            href="/"
            className="ml-auto flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke Website</span>
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
