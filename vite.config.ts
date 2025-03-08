import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/SIGNLEARN-sign_learning_platform/",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
