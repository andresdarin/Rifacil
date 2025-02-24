import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite accesos externos
    port: 5173,      // Mantiene el puerto estándar de Vite
    strictPort: true // Se asegura de que siempre use este puerto
  }
});
