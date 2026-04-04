import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "url"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@rahoot/web": fileURLToPath(new URL("./src", import.meta.url)),
      "@rahoot/common": fileURLToPath(
        new URL("../common/src", import.meta.url),
      ),
      "@rahoot/socket": fileURLToPath(
        new URL("../socket/src", import.meta.url),
      ),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
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
  build: {
    chunkSizeWarningLimit: 2000,
  },
})
