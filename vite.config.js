import restart from "vite-plugin-restart";

export default {
  publicDir: "public",
  base: "./",
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
};
