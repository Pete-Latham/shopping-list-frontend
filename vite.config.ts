import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to avoid CORS issues during development
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => {
          const rewritten = path.replace(/^\/api/, '');
          console.log(`[PROXY] ${path} -> ${rewritten}`);
          return rewritten;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[PROXY ERROR]', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('[PROXY REQ]', req.method, req.url, '->', proxyReq.path);
          });
        },
      },
    },
  },
})
