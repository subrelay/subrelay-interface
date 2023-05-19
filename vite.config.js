import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// import eslintPlugin from 'vite-plugin-eslint';
import { fileURLToPath } from 'node:url';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vueJsx(), vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      './runtimeConfig': './runtimeConfig.browser',
      process: 'process/browser', // TODO: check process
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },

  css: {
    // ref: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@/assets/variables.scss";
        `,
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 2000,
  },

  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    transformMode: { web: [/\.[jt]sx$/] },
    coverage: { provider: 'istanbul' },
  },
});
