import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), basicSsl()],
  build: {
    outDir: './docs',
    target: 'esnext'
  },
  base: './'
})
