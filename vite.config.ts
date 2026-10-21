import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// `base` muss zum Repo-Namen passen, damit GitHub Pages die Dateien findet.
export default defineConfig({
  base: '/ruhelage/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          katex: ['katex', 'marked'],
        },
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
