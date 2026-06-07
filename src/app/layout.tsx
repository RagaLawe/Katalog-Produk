import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Katalog Produk Unggulan - Dinas Perindag Kabupaten Ngada",
    template: "%s | Katalog Perindag Ngada",
  },
  description:
    "Katalog digital produk unggulan Kabupaten Ngada - Tenun Ikat, Kopi Bajawa, dan Kerajinan Bambu. Dikurasi oleh Dinas Perdagangan dan Perindustrian Kabupaten Ngada, NTT.",
  keywords: [
    "katalog produk",
    "Ngada",
    "tenun ikat",
    "kopi bajawa",
    "kerajinan bambu",
    "UMKM NTT",
    "Flores",
    "Perindag",
    "produk unggulan",
  ],
  authors: [{ name: "Dinas Perindag Kabupaten Ngada" }],
  openGraph: {
    title: "Katalog Produk Unggulan - Dinas Perindag Kabupaten Ngada",
    description:
      "Katalog digital produk unggulan Kabupaten Ngada - Tenun Ikat, Kopi Bajawa, dan Kerajinan Bambu. Dikurasi oleh Dinas Perdagangan dan Perindustrian Kabupaten Ngada, NTT.",
    type: "website",
    locale: "id_ID",
    siteName: "Katalog Perindag Ngada",
  },
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8B0000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
