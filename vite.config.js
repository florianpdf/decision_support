import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get base path from environment variable or default to root
// For GitHub Pages, this should be set to the repository name
const base = process.env.GITHUB_PAGES === 'true' 
  ? `/${process.env.GITHUB_REPOSITORY_NAME || 'bulle_chart'}/`
  : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        'src/test/',
        '**/*.config.js',
        '**/main.jsx',
        '**/*.css'
      ]
    }
  }
});
