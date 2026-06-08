import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * POST /api/products/[slug]/view
 * Record a product view
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Check if product exists
    const product = await db.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create a new view record
    await db.productView.create({
      data: {
        productId: product.id,
      },
    });

    // Get total view count for this product
    const viewCount = await db.productView.count({
      where: { productId: product.id },
    });

    return NextResponse.json({ viewCount });
  } catch (error) {
    console.error('Error recording product view:', error);
    return NextResponse.json(
      { error: 'Failed to record view' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products/[slug]/view
 * Get view count for a product
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

    const viewCount = await db.productView.count({
      where: { productId: product.id },
    });

    return NextResponse.json({ viewCount });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch view count' },
      { status: 500 }
    );
  }
}
