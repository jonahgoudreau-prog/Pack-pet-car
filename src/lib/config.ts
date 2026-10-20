export interface SupabaseConfig {
  url: string
  publishableKey: string
}

type SupabaseEnv = Pick<ImportMetaEnv, 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY'>

/** Reads the Supabase settings baked in at build time. Returns null until they're set. */
export function readSupabaseConfig(env: SupabaseEnv = import.meta.env): SupabaseConfig | null {
  const url = env.VITE_SUPABASE_URL?.trim()
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !publishableKey) return null
  return { url: url.replace(/\/+$/, ''), publishableKey }
}
