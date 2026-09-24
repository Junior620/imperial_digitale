import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { metadataPlugin } from './scripts/metadata'

export default defineConfig({
  plugins: [react(), tailwindcss(), metadataPlugin()],
})
