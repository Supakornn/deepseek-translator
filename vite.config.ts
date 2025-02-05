import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { copy } from "vite-plugin-copy";

export default defineConfig({
  plugins: [
    svelte(),
    copy({
      targets: [
        { src: "static/manifest.json", dest: "dist" },
        { src: "static/icon.png", dest: "dist" },
        { src: "src/popup.html", dest: "dist" }
      ]
    })
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      },
      input: {
        popup: "src/popup.svelte",
        background: "src/background.ts",
        content: "src/content.ts"
      }
    }
  }
});
