import { registerSW } from 'virtual:pwa-register'

let registration: ServiceWorkerRegistration | undefined

export function startServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, swRegistration) {
      registration = swRegistration
      // Home Screen apps resume instead of reloading, so look for a new deploy
      // every time Pack comes back to the foreground.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void swRegistration?.update()
      })
    },
  })
}

export type UpdateCheck = 'updating' | 'latest' | 'unavailable'

/** Asks for the latest deploy. If there is one, the page reloads itself once it's installed. */
export async function checkForUpdate(): Promise<UpdateCheck> {
  if (!registration) return 'unavailable'
  try {
    await registration.update()
  } catch {
    return 'unavailable'
  }
  return registration.installing || registration.waiting ? 'updating' : 'latest'
}
