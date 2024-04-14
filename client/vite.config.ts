import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 3000,
    proxy: {
      '/api': 'http://chat-api-v01-env.eba-petx5mmg.ap-south-1.elasticbeanstalk.com'
    }
  },
  plugins: [react()],
})
