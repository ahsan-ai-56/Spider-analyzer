cat > build.mjs << 'EOF'
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";
import { execSync } from "node:child_process";

const packageDir = path.dirname(fileURLToPath(import.meta.url));

async function buildAll() {
  const distDir = path.resolve(packageDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  await esbuild({
    entryPoints: [
      path.resolve(packageDir, "src/index.ts"),
      path.resolve(packageDir, "src/schema/index.ts"),
      path.resolve(packageDir, "src/schema/scans.ts"),
    ],
    platform: "node",
    bundle: false,
    format: "esm",
    outdir: distDir,
    outbase: path.resolve(packageDir, "src"),
    outExtension: { ".js": ".js" },
    logLevel: "info",
  });

  // Generate TypeScript declaration files (.d.ts)
  execSync("npx tsc --emitDeclarationOnly --declaration --outDir dist", {
    cwd: packageDir,
    stdio: "inherit",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
EOF
