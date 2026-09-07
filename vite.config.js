import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor";
          }
          if (id.includes("node_modules/framer-motion/")) {
            return "motion";
          }
          if (id.includes("node_modules/iconsax-reactjs/") || id.includes("node_modules/lucide-react/")) {
            return "icons";
          }
        },
      },
    },
  },
});
