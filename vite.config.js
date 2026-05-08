import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': {},
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: 'src/widget.jsx',
      name: 'ChatbotWidget',
      fileName: () => 'widget.js',
      formats: ['iife'],
    },
    cssCodeSplit: false,
    cssMinify: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    }
  }
})