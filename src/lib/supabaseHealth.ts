import type { SupabaseConfig } from './config'

export type SupabaseHealth =
  { state: 'unconfigured' } | { state: 'ok' } | { state: 'error'; message: string }

/**
 * Confirms the URL and publishable key work by asking Supabase Auth for its public settings.
 * Used by the Phase 0 shell to prove the Cloudflare build variables are right.
 */
export async function checkSupabase(
  config: SupabaseConfig | null,
  fetchFn: typeof fetch = (...args) => fetch(...args),
): Promise<SupabaseHealth> {
  if (!config) return { state: 'unconfigured' }

  let response: Response
  try {
    response = await fetchFn(`${config.url}/auth/v1/settings`, {
      headers: { apikey: config.publishableKey },
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return {
      state: 'error',
      message: "Couldn't reach Supabase. Check VITE_SUPABASE_URL and your connection.",
    }
  }

  if (response.ok) return { state: 'ok' }
  if (response.status === 401 || response.status === 403) {
    return {
      state: 'error',
      message: 'Supabase rejected the key. Check VITE_SUPABASE_PUBLISHABLE_KEY.',
    }
  }
  return {
    state: 'error',
    message: `Supabase answered ${response.status}. If the project is paused, restore it in the Supabase dashboard.`,
  }
}
