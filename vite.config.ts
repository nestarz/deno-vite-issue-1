import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nitro from "@analogjs/vite-plugin-nitro";
import { deno } from "./deno-vite-plugin/mod.ts";

export default defineConfig({
  plugins: [
    deno(),
    react(),
    nitro({
      ssr: true,
      entryServer: "src/index.tsx",
      prerender: {
        routes: ["/"],
      },
    }),
  ],
  environments: {
    ssr: {
      resolve: {
        noExternal: true,
      },
    },
  },
});
