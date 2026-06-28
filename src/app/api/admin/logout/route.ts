import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/logout
 *
 * Stateless logout: the JWT is not stored server-side, so "logout" simply
 * instructs the client to discard its token. We return success as long as a
 * Bearer token was provided (the client is responsible for removing it).
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // No server-side session to invalidate (JWT is stateless).
    // The client must delete the token from localStorage.
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
