import * as Sentry from "@sentry/vue"

declare global {
  interface Window {
    $sentry: typeof Sentry
  }
}
