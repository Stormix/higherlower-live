import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  server: {
    compatibilityDate: '2024-11-23',
    experimental: {
      websocket: true,
    },
    preset: 'bun',
  }
}).addRouter({
  name: 'websocket',
  type: 'http',
  handler: './app/ws.ts',
  target: 'server',
  base: '/_ws',
})
