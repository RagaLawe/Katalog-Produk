import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { getStorageConfig, uploadFile, ensureBucket } from '@/lib/supabase-storage';
import crypto from 'crypto';

/**
 * Image upload endpoint for admin product images.
 *
 * Strategy (auto-detected at runtime):
 *  1. Supabase Storage (production-preferred):
 *     If SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, upload to the
 *     `product-images` bucket and return its public URL. The bucket is
 *     auto-created if it doesn't exist (no manual Supabase Dashboard setup).
 *     This works on Vercel/serverless where the local filesystem is read-only.
 *
 *  2. Local filesystem (development):
 *     Saves to `public/uploads/` and returns `/uploads/<filename>`.
 *     Only used when NOT running on Vercel (i.e. local dev / sandbox).
 *
 *  3. Base64 data URL (last-resort fallback on Vercel without Supabase):
 *     Returns the image inline as a data URL so the upload never hard-fails
 *     even when no object storage is configured. A warning toast guides the
 *     admin to configure Supabase Storage for proper persistence.
 */

export const runtime = 'nodejs';
export const maxDuration = 30;

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

function sanitizeExt(mime: string): string {
  return MIME_TO_EXT[mime] || 'bin';
}

/**
 * Save file to local public/uploads/ directory (dev only).
 */
async function saveToLocal(
  fileBytes: Uint8Array,
  filename: string
): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, fileBytes as Buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  // 1. Authenticate admin
  const auth = await verifyAdmin(request);
  if (!auth.success) {
    return auth.response;
  }

  // 2. Parse multipart form
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Permintaan tidak valid: bukan multipart/form-data' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: 'File gambar tidak ditemukan pada field "file"' },
      { status: 400 }
    );
  }

  // 3. Validate type
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      {
        error: `Tipe file tidak diizinkan: ${file.type}. Hanya JPEG, PNG, WebP, GIF, AVIF.`,
      },
      { status: 415 }
    );
  }

  // 4. Validate size
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      {
        error: `Ukuran file terlalu besar: ${(file.size / 1024 / 1024).toFixed(
          2
        )} MB. Maksimal 8 MB.`,
      },
      { status: 413 }
    );
  }

  // 5. Read bytes
  const arrayBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(arrayBuffer);

  // 6. Generate unique object name: <yyyy>/<mm>/<cuid>.<ext>
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const cuid = crypto.randomUUID();
  const ext = sanitizeExt(file.type);
  const objectName = `${yyyy}/${mm}/${cuid}.${ext}`;
  const localFilename = `${cuid}.${ext}`;

  // 7. Strategy: Supabase Storage first, then local, then base64 fallback
  const config = getStorageConfig();

  if (config.configured) {
    const result = await uploadFile(fileBytes, file.type, objectName);
    if (result.url) {
      const response: { url: string; bucketCreated?: boolean } = { url: result.url };
      if (result.bucketCreated) {
        response.bucketCreated = true;
      }
      return NextResponse.json(response);
    }
    // If Supabase upload failed, fall through to local/fallback
    console.error('[upload] Supabase upload failed, falling back:', result.error);
  }

  // 8. Local filesystem (dev / sandbox)
  if (!config.isVercel) {
    try {
      const localUrl = await saveToLocal(fileBytes, localFilename);
      return NextResponse.json({ url: localUrl });
    } catch (err) {
      console.error('[upload] Local save failed:', err);
      return NextResponse.json(
        { error: 'Gagal menyimpan file ke disk lokal' },
        { status: 500 }
      );
    }
  }

  // 9. Last-resort fallback on Vercel without Supabase configured:
  //    return a base64 data URL so the upload still works for the admin,
  //    but warn that persistence requires Supabase Storage.
  const base64 = Buffer.from(fileBytes).toString('base64');
  const dataUrl = `data:${file.type};base64,${base64}`;

  return NextResponse.json(
    {
      url: dataUrl,
      warning:
        'Supabase Storage belum dikonfigurasi. Gambar disimpan sebagai data URL sementara. ' +
        'Atur SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di Vercel untuk persistensi.',
    },
    { status: 200 }
  );
}
