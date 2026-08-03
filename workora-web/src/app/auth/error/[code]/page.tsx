import { AuthErrorScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function AuthErrorPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ code }, resolvedSearchParams, status] = await Promise.all([
    params,
    searchParams || Promise.resolve({}),
    loadSystemStatus(),
  ]);

  const retryAfterValue = (resolvedSearchParams as Record<string, string | string[] | undefined>)?.retry_after_minutes;
  const retryAfterMinutes = typeof retryAfterValue === 'string'
    ? Number(retryAfterValue)
    : undefined;

  return (
    <AuthErrorScreen
      code={code as never}
      retryAfterMinutes={Number.isFinite(retryAfterMinutes) ? retryAfterMinutes : undefined}
      status={status}
    />
  );
}
