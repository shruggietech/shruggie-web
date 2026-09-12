import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadEnvConfig } from "@next/env";

import { createFirebaseEditorialBackend } from "../lib/editorial/firebase-admin";
import {
  createEditorialExportBundle,
  parseEditorialExport,
  serializeEditorialExport,
} from "../lib/editorial/export";

const repositoryRoot = process.cwd();
loadEnvConfig(repositoryRoot);

const outputArgument = process.argv
  .slice(2)
  .find((value) => value.startsWith("--output="));
if (!outputArgument) {
  throw new Error("Use --output=<new-directory-outside-the-repository>.");
}

const outputDirectory = path.resolve(outputArgument.slice("--output=".length));
const relativeToRepository = path.relative(repositoryRoot, outputDirectory);
if (
  relativeToRepository === "" ||
  (!relativeToRepository.startsWith("..") &&
    !path.isAbsolute(relativeToRepository))
) {
  throw new Error(
    "Editorial exports contain private drafts and must be written outside the repository.",
  );
}

const backend = createFirebaseEditorialBackend();
const bundle = await createEditorialExportBundle(
  backend.articles,
  backend.assets,
);

await mkdir(outputDirectory, { mode: 0o700 });
await mkdir(path.join(outputDirectory, "assets"), { mode: 0o700 });
const snapshotPath = path.join(outputDirectory, "editorial-export.json");
const assetManifestPath = path.join(outputDirectory, "asset-files.json");
await writeFile(snapshotPath, serializeEditorialExport(bundle.snapshot), {
  encoding: "utf8",
  flag: "wx",
  mode: 0o600,
});
await writeFile(
  assetManifestPath,
  `${JSON.stringify(
    bundle.assetFiles.map(({ assetId, checksumSha256, relativePath }) => ({
      assetId,
      checksumSha256,
      relativePath,
    })),
    null,
    2,
  )}\n`,
  { encoding: "utf8", flag: "wx", mode: 0o600 },
);
const writtenPaths = new Set<string>();
for (const file of bundle.assetFiles) {
  if (writtenPaths.has(file.relativePath)) continue;
  await writeFile(path.join(outputDirectory, file.relativePath), file.bytes, {
    flag: "wx",
    mode: 0o600,
  });
  writtenPaths.add(file.relativePath);
}

parseEditorialExport(await readFile(snapshotPath, "utf8"));
for (const file of bundle.assetFiles) {
  const bytes = await readFile(path.join(outputDirectory, file.relativePath));
  const checksum = createHash("sha256").update(bytes).digest("hex");
  if (checksum !== file.checksumSha256) {
    throw new Error(`Export read-back failed for ${file.assetId}.`);
  }
}

process.stdout.write(
  `${JSON.stringify(
    {
      outputDirectory,
      articleCount: bundle.snapshot.articles.length,
      assetCount: bundle.snapshot.assets.length,
      checksumsVerified: bundle.assetFiles.length,
    },
    null,
    2,
  )}\n`,
);
