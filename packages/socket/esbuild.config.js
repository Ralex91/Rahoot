import esbuild from "esbuild"
import path from "path"

export const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  outfile: "dist/index.cjs",
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  alias: {
    "@": path.resolve("./src"),
  },
}

esbuild.build(config)
