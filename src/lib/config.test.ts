import { describe, expect, it } from 'vitest'
import { readSupabaseConfig } from './config'

describe('readSupabaseConfig', () => {
  it('returns null when either value is missing', () => {
    expect(readSupabaseConfig({})).toBeNull()
    expect(readSupabaseConfig({ VITE_SUPABASE_URL: 'https://x.supabase.co' })).toBeNull()
    expect(readSupabaseConfig({ VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_x' })).toBeNull()
    expect(
      readSupabaseConfig({ VITE_SUPABASE_URL: '  ', VITE_SUPABASE_PUBLISHABLE_KEY: 'k' }),
    ).toBeNull()
  })

  it('trims whitespace and trailing slashes', () => {
    expect(
      readSupabaseConfig({
        VITE_SUPABASE_URL: ' https://abc.supabase.co/ ',
        VITE_SUPABASE_PUBLISHABLE_KEY: ' sb_publishable_123 ',
      }),
    ).toEqual({ url: 'https://abc.supabase.co', publishableKey: 'sb_publishable_123' })
  })
})
