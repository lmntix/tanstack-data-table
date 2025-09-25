import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { config } from "dotenv"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

config()

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"]
    }),

    tanstackStart({
      srcDirectory: "src",
      router: {
        routeToken: "_layout",
        routesDirectory: "app",
        quoteStyle: "double"
      }
    }),
    tailwindcss(),
    viteReact()
  ]
})
