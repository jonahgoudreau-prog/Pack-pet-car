/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope

// New deploys take over straight away; the page reloads itself when that happens.
void self.skipWaiting()
clientsClaim()

// Cache only the app shell (HTML, JS, CSS, fonts, icons). All data stays on the server.
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// Any in-app URL opens the cached shell, so Pack starts even without signal.
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))
