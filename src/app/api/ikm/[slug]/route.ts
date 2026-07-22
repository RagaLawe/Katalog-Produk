import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

interface Params {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/ikm/[slug]
 *   Public: get a single IKM by slug, including all its products.
 *
 * PUT /api/ikm/[slug]
 *   Admin only: update an existing IKM.
 *
 * DELETE /api/ikm/[slug]
 *   Admin only: delete an IKM. Products are kept (ikmId set to null).
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;

  const ikm = await db.ikm.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          price: true,
          description: true,
          imageUrl: true,
          isFeatured: true,
          whatsappNumber: true,
          marketplaceUrl: true,
        },
      },
      _count: { select: { products: true } },
    },
  });

  if (!ikm) {
    return NextResponse.json({ error: 'IKM tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json(ikm);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await verifyAdmin(request);
  if (!auth.success) return auth.response;

  const { slug } = await params;

  const existing = await db.ikm.findUnique({ where: { slug } });
  if (!existing) {
    return NextResponse.json({ error: 'IKM tidak ditemukan' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON valid' }, { status: 400 });
  }

  // Build update data — only fields that are present in body
  const data: Record<string, unknown> = {};
  if (typeof body.name === 'string') {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ error: 'Nama IKM tidak boleh kosong' }, { status: 400 });
    }
    if (name !== existing.name) {
      const dup = await db.ikm.findUnique({ where: { name } });
      if (dup && dup.id !== existing.id) {
        return NextResponse.json(
          { error: `Nama "${name}" sudah dipakai IKM lain` },
          { status: 409 }
        );
      }
    }
    data.name = name;
    // Auto-update slug if name changed and slug not explicitly set
    if (typeof body.slug !== 'string') {
      data.slug = slugify(name);
    }
  }
  if (typeof body.slug === 'string') {
    const newSlug = body.slug.trim() || slugify(String(data.name || existing.name));
    if (newSlug !== existing.slug) {
      const dup = await db.ikm.findUnique({ where: { slug: newSlug } });
      if (dup && dup.id !== existing.id) {
        return NextResponse.json(
          { error: `Slug "${newSlug}" sudah dipakai IKM lain` },
          { status: 409 }
        );
      }
    }
    data.slug = newSlug;
  }
  if (typeof body.category === 'string') {
    if (!['tenun', 'songket', 'kopi', 'bambu'].includes(body.category)) {
      return NextResponse.json(
        { error: 'Kategori tidak valid. Pilih: tenun, songket, kopi, bambu' },
        { status: 400 }
      );
    }
    data.category = body.category;
  }
  // Nullable string fields
  for (const f of [
    'description',
    'address',
    'phone',
    'whatsappNumber',
    'marketplaceUrl',
    'leaderName',
  ]) {
    if (body[f] !== undefined) {
      const v = typeof body[f] === 'string' ? body[f].trim() : null;
      data[f] = v || null;
    }
  }
  // Numeric nullable fields
  for (const f of ['establishedYear', 'memberCount']) {
    if (body[f] !== undefined) {
      const n = body[f] === null || body[f] === '' ? null : Number(body[f]);
      data[f] = n !== null && Number.isNaN(n) ? null : n;
    }
  }
  if (typeof body.isFeatured === 'boolean') {
    data.isFeatured = body.isFeatured;
  }

  try {
    const updated = await db.ikm.update({
      where: { id: existing.id },
      data,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PUT /api/ikm/[slug]] error:', err);
    return NextResponse.json({ error: 'Gagal memperbarui IKM' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await verifyAdmin(request);
  if (!auth.success) return auth.response;

  const { slug } = await params;

  const existing = await db.ikm.findUnique({ where: { slug } });
  if (!existing) {
    return NextResponse.json({ error: 'IKM tidak ditemukan' }, { status: 404 });
  }

  // Products get ikmId set to null (onDelete: SetNull) automatically
  await db.ikm.delete({ where: { id: existing.id } });

  return NextResponse.json({ message: 'IKM berhasil dihapus. Produk-produknya tetap ada (tanpa IKM).' });
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
