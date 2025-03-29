import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});