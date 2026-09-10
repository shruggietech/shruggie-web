import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "npm.cmd" : "npm";
const environment = {
  ...process.env,
  FIREBASE_PROJECT_ID: "demo-shruggie-web",
  FIREBASE_STORAGE_BUCKET: "demo-shruggie-web.firebasestorage.app",
  NEXT_PUBLIC_SITE_URL: "https://shruggie.tech",
};

for (const [label, args] of [
  ["production build", ["run", "build"]],
  [
    "production publication tests",
    ["exec", "--", "vitest", "run", "--config", "vitest.production.config.mts"],
  ],
]) {
  const result = spawnSync(command, args, {
    env: environment,
    shell: false,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error(`${label} failed.`);
    process.exit(result.status ?? 1);
  }
}
