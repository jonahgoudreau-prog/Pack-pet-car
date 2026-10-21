import { describe, expect, it } from 'vitest'
import { isStandalone } from './standalone'

const media = (matches: boolean) => () => ({ matches })

describe('isStandalone', () => {
  it('trusts navigator.standalone on iOS', () => {
    expect(isStandalone({ navigator: { standalone: true }, matchMedia: media(false) })).toBe(true)
  })

  it('falls back to the display-mode media query', () => {
    expect(isStandalone({ navigator: {}, matchMedia: media(true) })).toBe(true)
    expect(isStandalone({ navigator: { standalone: false }, matchMedia: media(false) })).toBe(false)
  })

  it('is false when nothing is available', () => {
    expect(isStandalone({})).toBe(false)
  })
})
