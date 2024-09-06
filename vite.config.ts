/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.*'],
    environment: 'jsdom',
    globals: true,
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
