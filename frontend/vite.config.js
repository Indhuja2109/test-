import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/',  // Set this to the correct base path if your app is not at the root
  plugins: [react()],
  server: {
    historyApiFallback: true, // Add this for routing fallback
  },
});
