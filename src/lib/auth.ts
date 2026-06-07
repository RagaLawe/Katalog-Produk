import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Server-side session store
export const sessions = new Map<string, { adminId: string; email: string; name: string | null }>();

/**
 * Verify admin authentication from the Authorization header.
 * Returns the session data if valid, or a NextResponse error if invalid.
 */
export async function verifyAdmin(request: NextRequest): Promise<
  | { success: true; session: { adminId: string; email: string; name: string | null } }
  | { success: false; response: NextResponse }
> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const session = sessions.get(token);

  if (!session) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Verify the admin still exists in the database
  const admin = await db.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, name: true },
  });

  if (!admin) {
    sessions.delete(token);
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Admin account not found' },
        { status: 401 }
      ),
    };
  }

  return {
    success: true,
    session: {
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
    },
  };
}
