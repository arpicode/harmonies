/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['**/*.test.*'],
    environment: 'jsdom',
    globals: true,
  },
})
