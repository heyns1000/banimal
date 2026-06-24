import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vercel-only build: React frontend only, no Cloudflare Worker or Mocha plugins.
// The Cloudflare Worker is deployed separately via .github/workflows/deploy-worker.yml.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
