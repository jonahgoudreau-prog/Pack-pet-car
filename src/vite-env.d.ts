interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __BUILD_INFO__: {
  sha: string
  branch: string
  builtAt: string
}

// Safari-only: true when running as a Home Screen web app.
interface Navigator {
  readonly standalone?: boolean
}
