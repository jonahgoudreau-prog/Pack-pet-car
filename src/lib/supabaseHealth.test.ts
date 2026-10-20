import { describe, expect, it, vi } from 'vitest'
import { checkSupabase } from './supabaseHealth'

const config = { url: 'https://abc.supabase.co', publishableKey: 'sb_publishable_123' }

function respondWith(status: number) {
  return vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status }))
}

describe('checkSupabase', () => {
  it('is unconfigured without settings and makes no request', async () => {
    const fetchFn = respondWith(200)
    expect(await checkSupabase(null, fetchFn)).toEqual({ state: 'unconfigured' })
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('calls the Auth settings endpoint with the publishable key', async () => {
    const fetchFn = respondWith(200)
    expect(await checkSupabase(config, fetchFn)).toEqual({ state: 'ok' })
    const [url, init] = fetchFn.mock.calls[0]!
    expect(url).toBe('https://abc.supabase.co/auth/v1/settings')
    expect(init?.headers).toEqual({ apikey: 'sb_publishable_123' })
  })

  it('explains a rejected key', async () => {
    const result = await checkSupabase(config, respondWith(401))
    expect(result).toMatchObject({ state: 'error', message: expect.stringContaining('key') })
  })

  it('reports other statuses', async () => {
    const result = await checkSupabase(config, respondWith(540))
    expect(result).toMatchObject({ state: 'error', message: expect.stringContaining('540') })
  })

  it('handles network failures', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Load failed'))
    const result = await checkSupabase(config, fetchFn)
    expect(result).toMatchObject({ state: 'error', message: expect.stringContaining('reach') })
  })
})
