# Task 7 - SEO Metadata & Structured Data

**Agent**: seo-metadata
**Date**: 2026-06-07
**Status**: ✅ Completed

### What was done

Added dynamic SEO metadata for product pages, enhanced root layout metadata, and added JSON-LD structured data for both products and the organization.

### Files Modified

1. **`/src/app/(public)/produk/[slug]/page.tsx`** - Added `generateMetadata` function
   - Fetches product from DB using slug via `db.product.findUnique`
   - Returns dynamic metadata with title, description, and OpenGraph data
   - Description truncated to 160 chars max
   - OpenGraph includes product image (1024x1024), type 'website', siteName
   - Uses Next.js 16 `params: Promise<{ slug: string }>` pattern
   - Added `ProductJsonLd` component to render structured data

2. **`/src/app/layout.tsx`** - Enhanced root metadata
   - `title.default`: 'Katalog Produk Unggulan - Dinas Perindag Kabupaten Ngada'
   - `title.template`: '%s | Katalog Perindag Ngada'
   - Updated `description` with new text
   - Updated `keywords` array (lowercase: katalog produk, Ngada, tenun ikat, kopi bajawa, kerajinan bambu, UMKM NTT, Flores, Perindag, produk unggulan)
   - Added `openGraph.siteName`: 'Katalog Perindag Ngada'
   - Added `robots`: 'index, follow'
   - Added `icons.icon`: '/logo.svg'

### Files Created

3. **`/src/components/ProductJsonLd.tsx`** - Product JSON-LD structured data component
   - Accepts props: name, description, imageUrl, price, category, artisanInfo
   - Renders `<script type="application/ld+json">` with schema.org Product schema
   - Includes Brand ("Produk Unggulan Ngada") and Offer (IDR, InStock)
   - Seller: "Dinas Perindag Kabupaten Ngada"

4. **`/src/components/OrganizationJsonLd.tsx`** - Organization JSON-LD structured data component
   - Renders GovernmentOrganization schema.org data
   - Includes name, alternateName, url, PostalAddress, telephone, email
   - Added to homepage (`/src/app/(public)/page.tsx`)

### Technical Notes

- All JSON-LD components use `dangerouslySetInnerHTML` for script injection
- Product metadata uses `generateMetadata` async function with Promise params (Next.js 16 pattern)
- Metadata text in Bahasa Indonesia where appropriate
