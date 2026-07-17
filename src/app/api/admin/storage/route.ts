import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import {
  getStorageConfig,
  probeStorage,
  ensureBucket,
} from '@/lib/supabase-storage';

export const runtime = 'nodejs';

/**
 * GET /api/admin/storage
 *   Returns the current storage configuration and a live probe of whether
 *   the Supabase bucket is reachable and exists.
 *
 * POST /api/admin/storage
 *   Bootstraps the public product-images bucket if it doesn't exist yet.
 *   Returns the post-action status.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.success) return auth.response;

  const config = getStorageConfig();
  const probe = await probeStorage();

  return NextResponse.json({
    config: {
      configured: config.configured,
      supabaseUrl: config.supabaseUrl,
      bucketName: config.bucketName,
      isVercel: config.isVercel,
    },
    probe: {
      reachable: probe.reachable,
      bucketExists: probe.bucketExists,
      buckets: probe.buckets,
      error: probe.error,
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.success) return auth.response;

  const config = getStorageConfig();
  if (!config.configured) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Supabase Storage belum dikonfigurasi. Set SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di environment variables server.',
      },
      { status: 400 }
    );
  }

  const result = await ensureBucket();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
