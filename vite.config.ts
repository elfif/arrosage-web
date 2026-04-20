import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
