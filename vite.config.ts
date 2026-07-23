import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tongyiApiPlugin } from './plugins/tongyiApi'

export default defineConfig({
  plugins: [react(), tongyiApiPlugin()],
  // 允许局域网内其他电脑访问（http://你的IP:5173）
  server: {
    host: true,
    port: 5173,
    // 穿透域名（loca.lt / trycloudflare.com 等）必须放行，否则会 403/Blocked request
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
})
