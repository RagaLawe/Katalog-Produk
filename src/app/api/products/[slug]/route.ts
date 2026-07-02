import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/products/[slug]
 * Get a single product by slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const product = await db.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[slug]
 * Update a product by slug (admin only)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { slug } = await params;

    // Check if product exists
    const existing = await db.product.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, category, price, description, artisanInfo, ikmName, whatsappNumber, marketplaceUrl, specifications, imageUrl, isFeatured } = body;

    // Validate category if provided
    if (category && !['tenun', 'songket', 'kopi', 'bambu'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: tenun, songket, kopi, bambu' },
        { status: 400 }
      );
    }

    // Validate marketplace URL format if provided
    if (marketplaceUrl !== undefined && marketplaceUrl && typeof marketplaceUrl === 'string' && marketplaceUrl.trim()) {
      try {
        new URL(marketplaceUrl.trim());
      } catch {
        return NextResponse.json(
          { error: 'Format URL marketplace tidak valid' },
          { status: 400 }
        );
      }
    }

    // Build update data with only provided fields
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description;
    if (artisanInfo !== undefined) updateData.artisanInfo = artisanInfo || null;
    if (ikmName !== undefined) updateData.ikmName = ikmName || null;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber || null;
    if (marketplaceUrl !== undefined) updateData.marketplaceUrl = marketplaceUrl || null;
    if (specifications !== undefined) updateData.specifications = specifications || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const product = await db.product.update({
      where: { slug },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[slug]
 * Delete a product by slug (admin only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { slug } = await params;

    // Check if product exists
    const existing = await db.product.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await db.product.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
