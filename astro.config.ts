import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import tailwind from "@astrojs/tailwind"

export default defineConfig({
    integrations: [
        preact({ compat: false }),
        tailwind()
    ],
    output: "server",
    server: { port: 3000 }
})