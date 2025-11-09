import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: base must be your repo name with leading/trailing slash
export default defineConfig({
  base: '/ai-stock-vault/',
  plugins: [react()],
})
