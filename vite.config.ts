import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert';





export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    https: {}, 
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
    define: {
    global: 'window'
  }
})