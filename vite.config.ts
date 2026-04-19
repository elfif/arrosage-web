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
    // Keep a tighter warning threshold now that we split vendors out.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('/recharts/') || id.includes('/victory-vendor/') || id.includes('/d3-')) {
            return 'recharts';
          }
          if (id.includes('/@radix-ui/') || id.includes('/radix-ui/')) {
            return 'radix';
          }
          if (id.includes('/@tanstack/react-router') || id.includes('/@tanstack/router-')) {
            return 'tanstack-router';
          }
          if (id.includes('/@tanstack/react-query') || id.includes('/@tanstack/query-')) {
            return 'tanstack-query';
          }
          if (id.includes('/lucide-react/')) {
            return 'lucide';
          }
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react';
          }
        },
      },
    },
  },
})
