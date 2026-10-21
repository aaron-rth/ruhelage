import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// `base` muss zum Repo-Namen passen, damit GitHub Pages die Dateien findet.
export default defineConfig({
  base: '/ruhelage/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Bibliotheken und Lerninhalte in eigene Dateien (besser cachebar, kein Riesen-Bundle)
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|zustand|scheduler)\//.test(id)) return 'react';
          if (/node_modules\/(katex|marked)\//.test(id)) return 'katex';
          if (id.includes('/src/content/')) return 'inhalt';
        },
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
