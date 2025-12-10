import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // allows imports like "@/components/Button"
    },
  },
  server: {
    port: 5173, // default Vite port, can change if needed
    open: true, // auto-open browser on dev start
  },
  build: {
    target: "esnext", // ensures modern output for Node 20/22/24
    outDir: "dist",
    sourcemap: true, // helpful for debugging production builds
  },
  css: {
    devSourcemap: true, // easier debugging of CSS in dev
  }
});
