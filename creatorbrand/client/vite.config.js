import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Vite 8 forwards browser console to the terminal by default; third-party extension
    // scripts can spam unrelated errors there. Use the browser DevTools console for front-end logs.
    forwardConsole: false,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:5000', ws: true }
    }
  }
})
