import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'node:path';

/**
 * Base config: dev/test behave normally.
 * `--mode preview` inlines the whole app into dist/index.html so the Freebuff
 * Preview tab can show the real app without a live server (loopback is
 * unavailable in this environment).
 */
const isPreview = process.argv.includes('--mode') && process.argv.includes('preview');

export default defineConfig({
  plugins: [react(), ...(isPreview ? [viteSingleFile()] : [])],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
