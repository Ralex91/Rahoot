import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@mindbuzz/web": path.resolve(__dirname, "./src"),
      "@mindbuzz/common": path.resolve(__dirname, "../common/src"),
      "@mindbuzz/socket": path.resolve(__dirname, "../socket/src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/media": {
        target: "http://localhost:3001",
      },
      "/ws": {
        target: "http://localhost:3001",
        ws: true,
      },
    },
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
  },
})

