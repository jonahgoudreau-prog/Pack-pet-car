/// <reference types="vitest/config" />
import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const BUTTER = '#FFEFB3'

function git(args: string): string | undefined {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return undefined
  }
}

// Shown in the app so you can tell which deploy you're looking at.
// Cloudflare Workers Builds and GitHub Actions both inject the commit and branch.
const buildInfo = {
  sha:
    process.env.WORKERS_CI_COMMIT_SHA ?? process.env.GITHUB_SHA ?? git('rev-parse HEAD') ?? 'dev',
  branch:
    process.env.WORKERS_CI_BRANCH ??
    process.env.GITHUB_REF_NAME ??
    git('rev-parse --abbrev-ref HEAD') ??
    'local',
  builtAt: new Date().toISOString(),
}

export default defineConfig({
  define: {
    __BUILD_INFO__: JSON.stringify(buildInfo),
  },
  plugins: [
    react(),
    VitePWA({
      // Our own service worker (src/sw.ts) so we can add push handlers in Phase 3.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: false,
      // The glob below already picks up the icons.
      includeManifestIcons: false,
      manifest: {
        id: '/',
        name: 'Pack',
        short_name: 'Pack',
        description: 'Take care of your dog together.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: BUTTER,
        theme_color: BUTTER,
        categories: ['lifestyle'],
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      injectManifest: {
        // Precache only the app shell. Data always comes from the server.
        globPatterns: ['**/*.{js,css,html,woff2,svg,png}'],
      },
    }),
  ],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
  },
})
