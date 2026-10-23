import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': import.meta.dirname || path.resolve('.'),
      },
    },
    server: {
      // The app is served through Express middleware, so Vite cannot own the
      // preview server's WebSocket upgrade lifecycle. Keep the client from
      // opening a socket that immediately closes in the hosted preview.
      hmr: false,
      watch: null,
    },
  };
});
