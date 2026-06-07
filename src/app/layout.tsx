import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Katalog Produk Unggulan - Dinas Perindag Kabupaten Ngada",
  description:
    "Katalog digital produk unggulan Kabupaten Ngada, NTT. Temukan Tenun Ikat, Kopi Bajawa, dan Kerajinan Bambu berkualitas tinggi dari Dinas Perdagangan dan Perindustrian Kabupaten Ngada.",
  keywords: [
    "Katalog Produk",
    "Ngada",
    "NTT",
    "Tenun Ikat",
    "Kopi Bajawa",
    "Kerajinan Bambu",
    "Dinas Perindag",
    "Produk Unggulan",
    "Bajawa",
  ],
  authors: [{ name: "Dinas Perindag Kabupaten Ngada" }],
  openGraph: {
    title: "Katalog Produk Unggulan - Dinas Perindag Kabupaten Ngada",
    description:
      "Katalog digital produk unggulan Kabupaten Ngada, NTT. Tenun Ikat, Kopi Bajawa, dan Kerajinan Bambu.",
    type: "website",
    locale: "id_ID",
  },
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
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
