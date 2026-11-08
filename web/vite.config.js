import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5174, proxy: { '/api': 'http://localhost:8200' } },
  build: { rollupOptions: { output: { manualChunks: { gsap: ['gsap'], react: ['react', 'react-dom'] } } } },
  test: { environment: 'jsdom', setupFiles: ['src/test-setup.js'], css: false },
})
