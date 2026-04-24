import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800, // Menghilangkan peringatan di bawah 800kB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Memisahkan vendor libraries besar
            if (id.includes('recharts') || id.includes('d3')) return 'chart-vendor';
            if (id.includes('react/') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('react-router') || id.includes('@remix-run')) return 'router-vendor';
            return 'vendor'; // Untuk dependensi lainnya
          }
        },
      },
    },
  },
});
