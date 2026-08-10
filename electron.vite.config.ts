import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: 'app/main/index.ts',
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: 'app/main/preload.ts',
      },
    },
  },
  renderer: {
    root: 'renderer',
    plugins: [react()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'renderer/index.html'),
      },
    },
  },
})
