export interface DisplayEnv {
  matchMedia?: (query: string) => { matches: boolean }
  navigator?: { standalone?: boolean }
}

/** True when Pack was opened from the Home Screen rather than a browser tab. */
export function isStandalone(env: DisplayEnv = window): boolean {
  if (env.navigator?.standalone === true) return true
  return env.matchMedia?.('(display-mode: standalone)').matches ?? false
}
