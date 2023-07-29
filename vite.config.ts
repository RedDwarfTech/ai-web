import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import { visualizer } from "rollup-plugin-visualizer";
import { PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "test.html",
      open:true 
    }) as PluginOption
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ],
    }
  },
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react','react-router-dom','react-dom'],
          reddwarf: ['rd-component','rdjs-wheel'],
          'vendor-redux': ['redux','redux-logger','redux-thunk','react-redux','react-modal','react-toastify','event-source-polyfill','@reduxjs/toolkit'],
          syntax: ['react-syntax-highlighter'],
          vendor: ['axios','dayjs','hashmap','idb','react-markdown','@fingerprintjs/fingerprintjs','uuid','rc-table','query-string','tslib']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  }
})
