import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { adorableCSS } from 'adorable-css/vite-plugin-adorable-css';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), adorableCSS()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
