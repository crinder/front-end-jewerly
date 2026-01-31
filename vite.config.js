import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: './tailwind.config.js',
    })/*,
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Seguros App',
        short_name: 'Seguros',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/app-clientes/home',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })*/
  ],
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: [
      'loca.lt',
      'since-magical-amount-retained.trycloudflare.com'
    ]
  }

})
