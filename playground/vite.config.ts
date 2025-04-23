import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // Provide a shim for `process.env`
    "process.env": {
      CSB_API_KEY: JSON.stringify(process.env.CSB_API_KEY),
      CSB_GLOBAL_API_KEY: JSON.stringify(process.env.CSB_GLOBAL_API_KEY),
    },
  },
});
