import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
    integrations: [preact({ compat: false })],
    vite: { plugins: [tailwindcss()] },
    output: "server",
    server: { port: 3000 }
})