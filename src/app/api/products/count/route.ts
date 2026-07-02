import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/products/count
 * Returns product counts per category and total
 */
export async function GET() {
  try {
    const [tenun, songket, kopi, bambu] = await Promise.all([
      db.product.count({ where: { category: 'tenun' } }),
      db.product.count({ where: { category: 'songket' } }),
      db.product.count({ where: { category: 'kopi' } }),
      db.product.count({ where: { category: 'bambu' } }),
    ]);

    const total = tenun + songket + kopi + bambu;

    return NextResponse.json({ tenun, songket, kopi, bambu, total });
  } catch (error) {
    console.error('Error fetching product counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product counts' },
      { status: 500 }
    );
  }
}
