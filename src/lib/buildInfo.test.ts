import { describe, expect, it } from 'vitest'
import { describeBuild } from './buildInfo'

describe('describeBuild', () => {
  it('shows the short commit, branch and build time', () => {
    const text = describeBuild(
      { sha: '1a2b3c4d5e6f', branch: 'main', builtAt: '2026-10-20T21:41:00Z' },
      { locale: 'en-US', timeZone: 'UTC' },
    )
    expect(text).toMatch(/^Build 1a2b3c4 · main · Oct 20, 9:41\sPM$/)
  })

  it('skips an unreadable build time', () => {
    expect(describeBuild({ sha: 'dev', branch: 'local', builtAt: 'nope' })).toBe(
      'Build dev · local',
    )
  })
})
