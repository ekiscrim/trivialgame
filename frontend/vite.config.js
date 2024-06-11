import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), envCompatible()],
  server: {
    port:3000,
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    }
  }
})
