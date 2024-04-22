import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@bs': fileURLToPath(new URL('node_modules/bootstrap/dist/css', import.meta.url)),
        '@bsi': fileURLToPath(new URL('node_modules/bootstrap-icons/font', import.meta.url))
      }
    },
    plugins: [vue()]
  }
})
