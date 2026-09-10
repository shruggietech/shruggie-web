import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "server-only": fileURLToPath(
        new URL("./tests/server-only-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    fileParallelism: false,
    hookTimeout: 120_000,
    include: ["tests/editorial/production-publication.production.test.ts"],
    testTimeout: 120_000,
  },
});
