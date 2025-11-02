import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  esbuild: {
    jsx: "transform",
    jsxFactory: "createDomElement",
    jsxFragment: "createDomFragment",
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "JustJSX",
      fileName: (format) => {
        const suffix = process.env.BUILD_UNMINIFIED ? "" : ".min";
        if (format === "es") return `index${suffix}.js`;
        if (format === "umd") return `just-jsx.umd${suffix}.js`;
        return `just-jsx.iife${suffix}.js`;
      },
      formats: ["es", "umd", "iife"],
    },
    minify: process.env.BUILD_UNMINIFIED ? false : "esbuild",
    outDir: "dist",
    rollupOptions: {
      external: [],
      output: {
        exports: "named",
      },
    },
  },
  plugins: [dts({ include: ["src/index.ts"] })],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.test.ts"],
    },
  },
});
