import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import tailwindcss from "@tailwindcss/vite"
import node from "@astrojs/node"

export default defineConfig({
    integrations: [preact({ compat: false })],
    vite: { plugins: [tailwindcss()], build: { minify: false, cssMinify: false } },
    output: "server",
    adapter: node({ mode: "standalone" }),
    server: { port: 3000 }
})