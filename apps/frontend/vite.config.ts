   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: "dist",
       sourcemap: true,
     },
     server: {
       proxy: {
         "/api": {
           target: "http://localhost:3001",
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, ""),
         },
       },
     },
     base: "./", // Ensure relative paths for assets
   });