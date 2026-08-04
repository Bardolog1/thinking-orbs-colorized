import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(__dirname),
  // The fork's Pages site lives under /thinking-orbs-colorized/ — without this
  // base, all built asset URLs would point at the repo root and 404.
  base: '/thinking-orbs-colorized/',
  plugins: [react(), tailwindcss()],
  server: { port: 5177 },
  resolve: {
    alias: {
      // Dogfood the public API exactly like a consumer would.
      'thinking-orbs-colorized': resolve(__dirname, '../src/index.ts')
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
});
