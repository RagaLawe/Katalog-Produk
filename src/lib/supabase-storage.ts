/**
 * Supabase Storage helper with auto-bootstrap.
 *
 * If the service_role key is configured, this module can:
 *  - Check whether a bucket exists
 *  - Create a PUBLIC bucket if it doesn't (auto-bootstrap)
 *  - Upload a file and return its public URL
 *
 * All operations use the native fetch + Supabase Storage REST API,
 * so no `@supabase/supabase-js` SDK dependency is needed.
 */

const DEFAULT_BUCKET = 'product-images';

export interface StorageConfig {
  configured: boolean;
  supabaseUrl: string | null;
  bucketName: string;
  isVercel: boolean;
}

export function getStorageConfig(): StorageConfig {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const bucketName =
    process.env.SUPABASE_PRODUCT_BUCKET || DEFAULT_BUCKET;
  return {
    configured: Boolean(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY),
    supabaseUrl,
    bucketName,
    isVercel: Boolean(process.env.VERCEL),
  };
}

function getServiceKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getServiceKey()}`,
    'Content-Type': 'application/json',
  };
}

/**
 * List all buckets. Returns null on auth/network error.
 */
export async function listBuckets(): Promise<
  { id: string; name: string; public: boolean }[] | null
> {
  const { supabaseUrl } = getStorageConfig();
  if (!supabaseUrl) return null;
  try {
    const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      headers: authHeaders(),
      method: 'GET',
    });
    if (!res.ok) {
      console.error('[supabase-storage] listBuckets failed:', res.status);
      return null;
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[supabase-storage] listBuckets error:', err);
    return null;
  }
}

/**
 * Create a public bucket. Returns true on success or if it already exists.
 */
export async function ensureBucket(): Promise<{
  ok: boolean;
  created: boolean;
  bucketName: string;
  error?: string;
}> {
  const { supabaseUrl, bucketName } = getStorageConfig();
  if (!supabaseUrl) {
    return { ok: false, created: false, bucketName, error: 'SUPABASE_URL not set' };
  }
  const key = getServiceKey();
  if (!key) {
    return {
      ok: false,
      created: false,
      bucketName,
      error: 'SUPABASE_SERVICE_ROLE_KEY not set',
    };
  }

  // 1. Check if bucket exists
  const buckets = await listBuckets();
  if (buckets === null) {
    return {
      ok: false,
      created: false,
      bucketName,
      error: 'Failed to list buckets (check service_role key)',
    };
  }
  const exists = buckets.some((b) => b.id === bucketName || b.name === bucketName);
  if (exists) {
    return { ok: true, created: false, bucketName };
  }

  // 2. Create the bucket as public
  try {
    const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        id: bucketName,
        name: bucketName,
        public: true,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return {
        ok: false,
        created: false,
        bucketName,
        error: `Create bucket failed (${res.status}): ${text}`,
      };
    }
    return { ok: true, created: true, bucketName };
  } catch (err) {
    return {
      ok: false,
      created: false,
      bucketName,
      error: `Network error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Upload a file to Supabase Storage. Auto-creates the bucket if missing.
 * Returns the public URL on success, or null on failure.
 */
export async function uploadFile(
  fileBytes: Uint8Array,
  mime: string,
  objectName: string
): Promise<{ url: string | null; error?: string; bucketCreated?: boolean }> {
  const { supabaseUrl, bucketName } = getStorageConfig();
  if (!supabaseUrl) {
    return { url: null, error: 'SUPABASE_URL not set' };
  }

  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${objectName}`;

  let res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getServiceKey()}`,
      'Content-Type': mime,
      'x-upsert': 'false',
    },
    body: fileBytes as Buffer,
  });

  // Auto-bootstrap bucket on 404 (bucket not found)
  if (res.status === 404) {
    const boot = await ensureBucket();
    if (!boot.ok) {
      return { url: null, error: boot.error, bucketCreated: false };
    }
    // Retry upload
    res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getServiceKey()}`,
        'Content-Type': mime,
        'x-upsert': 'false',
      },
      body: fileBytes as Buffer,
    });
    if (res.ok) {
      return {
        url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`,
        bucketCreated: true,
      };
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { url: null, error: `Upload failed (${res.status}): ${text}` };
  }

  return {
    url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`,
  };
}

/**
 * Quick health probe: can we reach Supabase Storage with the configured key?
 */
export async function probeStorage(): Promise<{
  reachable: boolean;
  bucketExists: boolean;
  bucketName: string;
  buckets: string[];
  error?: string;
}> {
  const { configured, bucketName } = getStorageConfig();
  if (!configured) {
    return {
      reachable: false,
      bucketExists: false,
      bucketName,
      buckets: [],
      error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured',
    };
  }
  const buckets = await listBuckets();
  if (buckets === null) {
    return {
      reachable: false,
      bucketExists: false,
      bucketName,
      buckets: [],
      error: 'Cannot reach Supabase Storage API',
    };
  }
  const ids = buckets.map((b) => b.id);
  return {
    reachable: true,
    bucketExists: ids.includes(bucketName),
    bucketName,
    buckets: ids,
  };
}
