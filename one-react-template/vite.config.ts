import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  envDir: "./configuration/environment",
  resolve: {
    alias: {
      '@core': fileURLToPath(new URL('./src/core/index.ts', import.meta.url))
    }
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  plugins: [
    react()
  ],
})