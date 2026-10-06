import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/**
 * The Home Tour's development placeholders (public/assets/home-tour/placeholder)
 * are copies of unconfirmed reference media and must never ship. Every production
 * build removes them from dist/; set HOME_TOUR_ALLOW_PLACEHOLDERS=1 to keep them
 * for a local preview of the build.
 */
function stripHomeTourPlaceholders(): Plugin {
  return {
    name: 'strip-home-tour-placeholders',
    apply: 'build',
    closeBundle() {
      if (process.env.HOME_TOUR_ALLOW_PLACEHOLDERS === '1') return
      rmSync(resolve('dist/assets/home-tour/placeholder'), { recursive: true, force: true })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), stripHomeTourPlaceholders()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    css: false,
  },
})
