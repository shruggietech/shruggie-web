import { loadEnvConfig } from "@next/env";
import path from "node:path";

import { createFirebaseEditorialBackend } from "../lib/editorial/firebase-admin";
import {
  loadRepositoryMigrationManifest,
  migrateRepositoryBlog,
  repositoryMigrationSummary,
} from "../lib/editorial/repository-migration";

const repositoryRoot = process.cwd();
loadEnvConfig(repositoryRoot);

async function main(): Promise<void> {
  const argumentsSet = new Set(process.argv.slice(2));
  const apply = argumentsSet.has("--apply");
  const dryRun = argumentsSet.has("--dry-run") || !apply;
  if (apply && argumentsSet.has("--dry-run")) {
    throw new Error("Choose either --dry-run or --apply, not both.");
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT;
  if (!projectId) throw new Error("FIREBASE_PROJECT_ID is required.");
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error("FIREBASE_STORAGE_BUCKET is required.");
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL is required.");
  }

  if (apply) {
    const confirmation = [...argumentsSet].find((value) =>
      value.startsWith("--confirm-project="),
    );
    if (confirmation !== `--confirm-project=${projectId}`) {
      throw new Error(
        `Applying the migration requires --confirm-project=${projectId}.`,
      );
    }
  }

  const backend = createFirebaseEditorialBackend();
  const manifest = await loadRepositoryMigrationManifest(
    path.join(
      repositoryRoot,
      "docs",
      "editorial",
      "blog-migration-manifest.json",
    ),
  );
  const report = await migrateRepositoryBlog({
    apply: !dryRun,
    articleRepository: backend.articles,
    assetStore: backend.assets,
    manifest,
    repositoryRoot,
    siteOrigin: process.env.NEXT_PUBLIC_SITE_URL,
  });

  process.stdout.write(
    `${JSON.stringify(repositoryMigrationSummary(report), null, 2)}\n`,
  );
}

void main();
