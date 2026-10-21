import { useEffect, useState } from 'react'

export type OfflineStatus = 'unsupported' | 'dev' | 'pending' | 'ready'

/** Whether the service worker has finished saving the app shell on this device. */
export function useOfflineStatus(): OfflineStatus {
  const [status, setStatus] = useState<OfflineStatus>(() => {
    if (!('serviceWorker' in navigator)) return 'unsupported'
    if (import.meta.env.DEV) return 'dev'
    return 'pending'
  })

  useEffect(() => {
    if (status !== 'pending') return
    let cancelled = false
    void navigator.serviceWorker.ready.then(() => {
      if (!cancelled) setStatus('ready')
    })
    return () => {
      cancelled = true
    }
  }, [status])

  return status
}
