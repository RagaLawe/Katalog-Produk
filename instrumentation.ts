/**
 * Next.js instrumentation — runs once on server startup.
 *
 * Registers global handlers to prevent the dev server from crashing when
 * the database is unreachable (e.g. sandbox environments where Supabase DB
 * ports are blocked). In production (Vercel), the DB is reachable and these
 * handlers are simply safety nets.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    process.on('unhandledRejection', (reason) => {
      // Prisma connection errors in dev (unreachable DB) land here.
      // Log but do NOT crash the process.
      const msg = String(reason ?? '');
      if (msg.includes('Can\'t reach database server') || msg.includes('P1001') || msg.includes('timed out')) {
        console.warn('[instrumentation] DB connection error suppressed (likely unreachable in this environment):', msg.slice(0, 120));
        return;
      }
      console.error('[instrumentation] Unhandled rejection:', reason);
    });

    process.on('uncaughtException', (err) => {
      const msg = String(err?.message ?? err);
      if (msg.includes('Can\'t reach database server') || msg.includes('P1001') || msg.includes('timed out')) {
        console.warn('[instrumentation] DB connection error suppressed:', msg.slice(0, 120));
        return;
      }
      console.error('[instrumentation] Uncaught exception:', err);
    });
  }
}
