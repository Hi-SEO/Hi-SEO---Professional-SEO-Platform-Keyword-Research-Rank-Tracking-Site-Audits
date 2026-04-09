import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router": ["react-router-dom"],
          "motion": ["framer-motion"],
          "charts": ["recharts"],
          "supabase": ["@supabase/supabase-js"],
          "icons": ["lucide-react"],
          "utils": ["clsx", "tailwind-merge", "date-fns"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "recharts",
      "@supabase/supabase-js",
      "lucide-react",
    ],
  },
  server: {
    port: 5173,
    host: true,
  },
});
