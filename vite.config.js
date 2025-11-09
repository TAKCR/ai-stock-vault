import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for AI Stock Vault (GitHub Pages)
// ----------------------------------------------------
// ⚙️ Key note:
// The "base" option must match your GitHub repo name,
// otherwise your site will appear blank when hosted on Pages.
// Example: https://takcr.github.io/ai-stock-vault/
// Repo name = ai-stock-vault → base: '/ai-stock-vault/'

export default defineConfig({
  base: '/ai-stock-vault/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  },
})
