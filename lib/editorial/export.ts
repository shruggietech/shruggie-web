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
