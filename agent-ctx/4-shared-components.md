# Task 4 - Shared Components & Layout Agent

## Summary
Created the root layout, header, footer, and all shared components for the Dinas Perindag Kabupaten Ngada e-catalogue website.

## Files Created/Modified

### Modified
- `src/app/layout.tsx` - Updated with Indonesian lang, new metadata, Toaster from sonner, Header/Footer integration, min-h-screen flex wrapper for sticky footer

### Created
- `src/components/Header.tsx` - Responsive header with sticky positioning, backdrop blur, tenun-border-top, desktop nav + mobile Sheet menu, active link highlighting via usePathname
- `src/components/Footer.tsx` - Sticky footer with Perindag info, address, contact, quick links, copyright, tenun-pattern background, tenun-border-top
- `src/components/WhatsAppButton.tsx` - Reusable WA button with pre-filled message, wa-pulse animation, green styling
- `src/components/CategoryBadge.tsx` - Colored badges for tenun (red), kopi (brown), bambu (green) categories
- `src/components/TrustBadge.tsx` - Gold-accented trust badges for 'asli' and 'dikurasi' types
- `src/components/PriceDisplay.tsx` - Indonesian Rupiah formatter using Intl.NumberFormat

## Design Decisions
- Used `tenun-border-top` class on both Header and Footer for cultural accent consistency
- Header uses `bg-background/90 backdrop-blur-md` for a clean glass effect
- Footer uses `bg-warm-cream-dark tenun-pattern` for a warm, cultural feel
- Mobile navigation uses shadcn Sheet component (slide from right)
- WhatsApp button defaults to a fallback number if env var not set
- All components are properly typed with TypeScript interfaces
- All UI text is in Bahasa Indonesia
