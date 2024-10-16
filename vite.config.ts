import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Add other libraries or modules you want to split
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase the warning limit if needed
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})