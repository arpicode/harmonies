/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'
import { coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },

  test: {
    include: ['**/*.test.*'],
    environment: 'jsdom',
    globals: true,
    setupFiles: 'src/test-setup',
    coverage: {
      include: ['**/*.ts'],
      exclude: [
        '**/main.ts',
        '**/main-utils.ts',
        '**/interfaces/**',
        '**/genetic/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
})
