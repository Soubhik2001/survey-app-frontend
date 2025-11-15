// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // Import the plugin

export default defineConfig({
  plugins: [
    react(),
    // Add the PWA plugin
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      devOptions: {
        enabled: true // Enables PWA features in dev mode for testing
      },
      manifest: {
        name: 'Student Survey PWA',
        short_name: 'SurveyApp',
        description: 'A dynamic survey and weather PWA.',
        theme_color: '#ffffff', // Sets the toolbar color
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // Path relative to public folder
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Path relative to public folder
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Ensures icon looks good on all devices
          }
        ]
      }
    })
  ]
})