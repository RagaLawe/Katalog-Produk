import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

/**
 * Stateless JWT-based admin authentication.
 *
 * Previous implementation used an in-memory `Map` for sessions, which does NOT
 * work on serverless platforms (Vercel) because each function invocation may
 * hit a different instance. JWTs are self-contained and verified via HMAC,
 * so authentication works across any number of instances.
 */

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

if (!JWT_SECRET) {
  // Fall back to a dev-only secret. This MUST be set in production.
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: ADMIN_JWT_SECRET is not set in production.');
  }
}

const SECRET = JWT_SECRET || 'dev-insecure-secret-do-not-use-in-production';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface AdminTokenPayload {
  adminId: string;
  email: string;
  name: string | null;
  iat: number;
  exp: number;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: AdminTokenPayload): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

function verify(token: string): AdminTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const data = `${header}.${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('base64url');

  // Use timing-safe comparison to mitigate timing attacks
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf-8')
    ) as AdminTokenPayload;
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Create a signed JWT for an authenticated admin.
 */
export function createAdminToken(admin: {
  id: string;
  email: string;
  name: string | null;
}): string {
  const now = Date.now();
  return sign({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    iat: now,
    exp: now + TOKEN_TTL_MS,
  });
}

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
  const payload = verify(token);

  if (!payload) {
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
    where: { id: payload.adminId },
    select: { id: true, email: true, name: true },
  });

  if (!admin) {
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
