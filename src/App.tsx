import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { CheckIcon, PawIcon } from './components/icons'
import { describeBuild } from './lib/buildInfo'
import { readSupabaseConfig } from './lib/config'
import { isStandalone } from './lib/standalone'
import { checkSupabase, type SupabaseHealth } from './lib/supabaseHealth'
import { checkForUpdate, type UpdateCheck } from './pwa/registerServiceWorker'
import { useOfflineStatus, type OfflineStatus } from './pwa/useOfflineStatus'

// Phase 0 shell: proves the Home Screen install, service worker and Supabase settings work.
// Replaced by sign-in and Home in Phase 1.

interface Step {
  title: string
  detail: string
  done: boolean
  problem?: boolean
}

function installStep(standalone: boolean): Step {
  return standalone
    ? { title: 'Add to Home Screen', detail: 'Done. Pack opens full screen.', done: true }
    : {
        title: 'Add to Home Screen',
        detail:
          'In Safari, tap Share, then Add to Home Screen. On iOS 26 and later, Share is in the ••• menu. Leave “Open as Web App” on, then open Pack from your Home Screen.',
        done: false,
      }
}

function offlineStep(status: OfflineStatus): Step {
  const title = 'Works offline'
  switch (status) {
    case 'ready':
      return { title, detail: 'Done. The app is saved on this device.', done: true }
    case 'pending':
      return { title, detail: 'Saving the app on this device…', done: false }
    case 'dev':
      return { title, detail: 'Only in the deployed app.', done: false }
    case 'unsupported':
      return { title, detail: "This browser can't save the app.", done: false, problem: true }
  }
}

function supabaseStep(health: SupabaseHealth | null): Step {
  const title = 'Connected to Supabase'
  if (!health) return { title, detail: 'Checking…', done: false }
  switch (health.state) {
    case 'ok':
      return { title, detail: 'Done. Pack can reach your Supabase project.', done: true }
    case 'unconfigured':
      return {
        title,
        detail: 'Not set up yet. Add the two Cloudflare build variables, then redeploy.',
        done: false,
      }
    case 'error':
      return { title, detail: health.message, done: false, problem: true }
  }
}

const updateLabels: Record<UpdateCheck | 'checking', string> = {
  checking: 'Checking…',
  updating: 'Updating…',
  latest: 'Up to date',
  unavailable: "Can't check right now",
}

export default function App() {
  const [standalone] = useState(() => isStandalone())
  const offline = useOfflineStatus()
  const [health, setHealth] = useState<SupabaseHealth | null>(null)
  const [update, setUpdate] = useState<UpdateCheck | 'checking' | null>(null)

  useEffect(() => {
    let cancelled = false
    void checkSupabase(readSupabaseConfig()).then((result) => {
      if (!cancelled) setHealth(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const steps = [installStep(standalone), offlineStep(offline), supabaseStep(health)]
  const doneCount = steps.filter((step) => step.done).length
  const currentIndex = steps.findIndex((step) => !step.done)

  async function onCheckForUpdate() {
    setUpdate('checking')
    setUpdate(await checkForUpdate())
  }

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.brand}>
          <span className={styles.logo}>
            <PawIcon />
          </span>
          Pack
        </span>
        <span className={styles.progress}>
          {doneCount} of {steps.length} done
        </span>
      </header>

      <h1 className={styles.title}>
        {currentIndex === -1 ? 'Pack is ready to build on' : 'Make Pack feel like an app'}
      </h1>
      <p className={styles.subtitle}>
        {currentIndex === -1
          ? 'This is the empty shell. Next up: sign-in, your household and meals.'
          : 'This is the empty shell. Once all three are done, we start on features.'}
      </p>

      <ol className={styles.steps}>
        {steps.map((step, index) => {
          const current = index === currentIndex
          const state = step.done ? styles.done : current ? styles.current : styles.todo
          return (
            <li key={step.title} className={`${styles.step} ${state}`}>
              <span
                className={step.problem ? `${styles.badge} ${styles.problem}` : styles.badge}
                aria-hidden="true"
              >
                {step.done ? <CheckIcon /> : step.problem ? '!' : index + 1}
              </span>
              <div className={styles.stepText}>
                <span className={styles.stepTitle}>{step.title}</span>
                <span className={styles.stepDetail}>{step.detail}</span>
              </div>
            </li>
          )
        })}
      </ol>

      <footer className={styles.footer}>
        <span className="num">{describeBuild()}</span>
        <button
          type="button"
          className={styles.updateButton}
          onClick={() => void onCheckForUpdate()}
          disabled={update === 'checking' || update === 'updating'}
        >
          {update ? updateLabels[update] : 'Check for update'}
        </button>
      </footer>
    </main>
  )
}
