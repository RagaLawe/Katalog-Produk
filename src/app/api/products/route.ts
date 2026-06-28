import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

/**
 * GET /api/products
 * List all products with optional filtering
 * Query params: category (tenun/kopi/bambu), search (by name), featured (boolean)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};

    if (category && ['tenun', 'kopi', 'bambu'].includes(category)) {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (featured !== null) {
      where.isFeatured = featured === 'true';
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();
    const { name, slug, category, price, description, artisanInfo, ikmName, whatsappNumber, marketplaceUrl, imageUrl, isFeatured } = body;

    // Validate required fields
    if (!name || !slug || !category || !price || !description || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, category, price, description, imageUrl' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['tenun', 'kopi', 'bambu'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: tenun, kopi, bambu' },
        { status: 400 }
      );
    }

    // Validate marketplace URL format if provided
    if (marketplaceUrl && typeof marketplaceUrl === 'string' && marketplaceUrl.trim()) {
      try {
        new URL(marketplaceUrl.trim());
      } catch {
        return NextResponse.json(
          { error: 'Format URL marketplace tidak valid' },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists
    const existing = await db.product.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        category,
        price: Number(price),
        description,
        artisanInfo: artisanInfo || null,
        ikmName: ikmName || null,
        whatsappNumber: whatsappNumber || null,
        marketplaceUrl: marketplaceUrl || null,
        imageUrl,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
