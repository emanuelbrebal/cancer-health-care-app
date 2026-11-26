import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Sem proxy: o cookie de sessão tem Path=/auth/web e precisa ver o caminho real da API.
// Em dev, localhost:5173 e localhost:3000 são o mesmo "site", então SameSite=Strict funciona.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173 },
})
