import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Same-origin `/api` as in production (Caddy). Dev/preview proxy to FastAPI.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') || '/',
      },
    },
  },
  preview: {
    allowedHosts: ['arrosage-pi.local'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') || '/',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Only split out recharts (and its d3/victory-vendor deps): it's big
        // and lazy-loaded on /journal only. Splitting react/radix/tanstack
        // into separate chunks triggers init-order issues with React 19 +
        // Radix (`Cannot read properties of undefined (reading 'forwardRef')`).
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('/recharts/') ||
            id.includes('/victory-vendor/') ||
            id.includes('/d3-')
          ) {
            return 'recharts';
          }
        },
      },
    },
  },
})
