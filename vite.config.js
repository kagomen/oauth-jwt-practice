import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/test': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
