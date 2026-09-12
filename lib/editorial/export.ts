import { createHash } from "node:crypto";

import {
  EDITORIAL_EXPORT_VERSION,
  editorialExportSchemaV1,
  type EditorialExport,
} from "./domain";
import type { ArticleRepository, AssetStore } from "./ports";

export async function createEditorialExport(
  articles: ArticleRepository,
  assets: AssetStore,
  exportedAt = new Date().toISOString(),
): Promise<EditorialExport> {
  const snapshot = {
    schemaVersion: EDITORIAL_EXPORT_VERSION,
    exportedAt,
    articles: (await articles.exportAll()).sort((a, b) =>
      a.id.localeCompare(b.id),
    ),
    assets: (await assets.exportAll()).sort((a, b) => a.id.localeCompare(b.id)),
  };

  return editorialExportSchemaV1.parse(snapshot);
}

export function serializeEditorialExport(snapshot: EditorialExport): string {
  const validated = editorialExportSchemaV1.parse(snapshot);
  return `${JSON.stringify(validated)}\n`;
}

export function parseEditorialExport(serialized: string): EditorialExport {
  return editorialExportSchemaV1.parse(JSON.parse(serialized));
}

const extensionByContentType: Readonly<Record<string, string>> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export interface EditorialExportAssetFile {
  assetId: string;
  bytes: Uint8Array;
  checksumSha256: string;
  relativePath: string;
}

export interface EditorialExportBundle {
  assetFiles: EditorialExportAssetFile[];
  snapshot: EditorialExport;
}

/**
 * Export records and private asset bytes together so the provider-neutral
 * snapshot is independently recoverable rather than only describing objects
 * that still exist in Cloud Storage.
 */
export async function createEditorialExportBundle(
  articles: ArticleRepository,
  assets: AssetStore,
  exportedAt = new Date().toISOString(),
): Promise<EditorialExportBundle> {
  const snapshot = await createEditorialExport(articles, assets, exportedAt);
  const assetFiles: EditorialExportAssetFile[] = [];

  for (const asset of snapshot.assets) {
    const stored = await assets.read(asset.id);
    if (!stored) {
      throw new Error(`Export asset bytes are missing for ${asset.id}.`);
    }
    const checksumSha256 = createHash("sha256")
      .update(stored.bytes)
      .digest("hex");
    if (checksumSha256 !== asset.checksumSha256) {
      throw new Error(`Export asset checksum failed for ${asset.id}.`);
    }
    const extension = extensionByContentType[asset.contentType];
    if (!extension) {
      throw new Error(
        `Export asset type is unsupported: ${asset.contentType}.`,
      );
    }
    assetFiles.push({
      assetId: asset.id,
      bytes: stored.bytes,
      checksumSha256,
      relativePath: `assets/${checksumSha256}.${extension}`,
    });
  }

  return { snapshot, assetFiles };
}
