import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';

/**
 * GET /api/admin/verify
 * Verify admin token and return admin info
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request);

    if (!authResult.success) {
      return authResult.response;
    }

    return NextResponse.json({
      admin: {
        id: authResult.session.adminId,
        email: authResult.session.email,
        name: authResult.session.name,
      },
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}
