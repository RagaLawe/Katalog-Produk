import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

/**
 * GET /api/ikm
 *   Public: list all IKM. Optional query:
 *     ?featured=true      → only featured IKMs
 *     ?category=tenun     → filter by category
 *     ?withProducts=true  → include product count + first 4 products per IKM
 *
 * POST /api/ikm
 *   Admin only: create a new IKM record.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';
  const category = searchParams.get('category');
  const withProducts = searchParams.get('withProducts') === 'true';

  const where: Record<string, unknown> = {};
  if (featured) where.isFeatured = true;
  if (category) where.category = category;

  const ikms = await db.ikm.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    include: withProducts
      ? {
          products: {
            take: 4,
            orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              price: true,
              imageUrl: true,
              isFeatured: true,
            },
          },
          _count: { select: { products: true } },
        }
      : { _count: { select: { products: true } } },
  });

  return NextResponse.json(ikms);
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.success) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON valid' }, { status: 400 });
  }

  const name = (body.name as string | undefined)?.trim();
  const slug = (body.slug as string | undefined)?.trim() || slugify(name || '');
  const category = (body.category as string | undefined)?.trim();

  if (!name) {
    return NextResponse.json({ error: 'Nama IKM wajib diisi' }, { status: 400 });
  }
  if (!category || !['tenun', 'songket', 'kopi', 'bambu'].includes(category)) {
    return NextResponse.json(
      { error: 'Kategori tidak valid. Pilih: tenun, songket, kopi, bambu' },
      { status: 400 }
    );
  }

  // Check uniqueness
  const existsByName = await db.ikm.findUnique({ where: { name } });
  if (existsByName) {
    return NextResponse.json(
      { error: `IKM dengan nama "${name}" sudah ada` },
      { status: 409 }
    );
  }
  const existsBySlug = await db.ikm.findUnique({ where: { slug } });
  if (existsBySlug) {
    return NextResponse.json(
      { error: `Slug "${slug}" sudah dipakai IKM lain` },
      { status: 409 }
    );
  }

  try {
    const ikm = await db.ikm.create({
      data: {
        name,
        slug,
        category,
        description: (body.description as string | undefined)?.trim() || null,
        address: (body.address as string | undefined)?.trim() || null,
        phone: (body.phone as string | undefined)?.trim() || null,
        whatsappNumber: (body.whatsappNumber as string | undefined)?.trim() || null,
        marketplaceUrl: (body.marketplaceUrl as string | undefined)?.trim() || null,
        establishedYear: body.establishedYear ? Number(body.establishedYear) : null,
        leaderName: (body.leaderName as string | undefined)?.trim() || null,
        memberCount: body.memberCount ? Number(body.memberCount) : null,
        isFeatured: Boolean(body.isFeatured),
      },
    });
    return NextResponse.json(ikm, { status: 201 });
  } catch (err) {
    console.error('[POST /api/ikm] error:', err);
    return NextResponse.json(
      { error: 'Gagal membuat IKM' },
      { status: 500 }
    );
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}
