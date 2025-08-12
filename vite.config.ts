import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to avoid CORS issues during development
      // Use backend container name when running in the same Docker network
      '/api': {
        target: process.env.DOCKER_CONTAINER ? 'http://shopping-list-backend:3000' : 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => {
          const rewritten = path.replace(/^\/api/, '');
          if (typeof console !== 'undefined') {
            // console.log(`[PROXY] ${path} -> ${rewritten}`);
          }
          return rewritten;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (_err, _req, _res) => {
            if (typeof console !== 'undefined') {
              // console.log('[PROXY ERROR]', err);
            }
          });
          proxy.on('proxyReq', (_proxyReq, _req, _res) => {
            if (typeof console !== 'undefined') {
              // console.log('[PROXY REQ]', req.method, req.url, '->', proxyReq.path);
            }
          });
        },
      },
    },
  },
})
