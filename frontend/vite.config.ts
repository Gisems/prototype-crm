import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import svgrPlugin from "vite-plugin-svgr"

// 5008 y no 5007: el portal de clinic ya usa ese puerto y pueden correr a la vez.
const port = 5008

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), reactRouter(), svgrPlugin()],
  server: {
    port,
    open: true,
    host: true,
  },
})
