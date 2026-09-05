import { z } from "zod";

import { EditorialValidationError } from "./errors";
import { inspectMarkdown } from "./markdown-policy";

export const ARTICLE_SCHEMA_VERSION = 1 as const;
export const EDITORIAL_EXPORT_VERSION = 1 as const;
export const MAX_ARTICLE_BODY_BYTES = 512 * 1024;
export const MAX_ASSET_BYTES = 5 * 1024 * 1024;
export const MAX_ASSET_DIMENSION = 6000;

export const allowedAssetContentTypes = [
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const editorialIdSchema = z
  .string()
  .trim()
  .min(3)
  .max(128)
  .regex(
    /^[a-z0-9][a-z0-9:_-]*$/,
    "Use lowercase letters, numbers, colons, underscores, and hyphens.",
  );

export const articleSlugSchema = z
  .string()
  .trim()
  .min(3)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase words separated by single hyphens.",
  );

const isoDateTimeSchema = z.string().datetime({ offset: true });

export const articleStateSchema = z.enum(["draft", "published", "archived"]);

export const assetReferenceSchema = z
  .object({
    assetId: editorialIdSchema,
    deliveryUrl: z
      .string()
      .trim()
      .min(1)
      .refine(
        (value) =>
          (value.startsWith("/") && !value.startsWith("//")) ||
          (() => {
            try {
              return new URL(value).protocol === "https:";
            } catch {
              return false;
            }
          })(),
        "Use a root-relative path or HTTPS delivery URL.",
      ),
    altText: z.string().trim().min(5).max(300),
  })
  .strict();

export const articleRevisionSchema = z
  .object({
    number: z.number().int().positive(),
    previousNumber: z.number().int().positive().nullable(),
    updatedAt: isoDateTimeSchema,
    updatedBy: editorialIdSchema,
  })
  .strict();

export const articleBodySchema = z
  .object({
    format: z.literal("markdown"),
    source: z
      .string()
      .trim()
      .min(1)
      .refine(
        (source) =>
          new TextEncoder().encode(source).byteLength <= MAX_ARTICLE_BODY_BYTES,
        `Article Markdown must not exceed ${MAX_ARTICLE_BODY_BYTES} bytes.`,
      )
      .superRefine((source, context) => {
        for (const issue of inspectMarkdown(source)) {
          context.addIssue({
            code: "custom",
            message: issue.line
              ? `Line ${issue.line}: ${issue.message}`
              : issue.message,
          });
        }
      }),
  })
  .strict();

export const articleSchemaV1 = z
  .object({
    schemaVersion: z.literal(ARTICLE_SCHEMA_VERSION),
    id: editorialIdSchema,
    slug: articleSlugSchema,
    title: z.string().trim().min(3).max(160),
    excerpt: z.string().trim().min(10).max(400),
    author: z
      .object({
        id: editorialIdSchema,
        name: z.string().trim().min(2).max(120),
      })
      .strict(),
    category: z.string().trim().min(2).max(80),
    body: articleBodySchema,
    state: articleStateSchema,
    createdAt: isoDateTimeSchema,
    modifiedAt: isoDateTimeSchema,
    publishedAt: isoDateTimeSchema.nullable(),
    featuredImage: assetReferenceSchema.nullable(),
    ogImage: assetReferenceSchema.nullable(),
    revision: articleRevisionSchema,
  })
  .strict()
  .superRefine((article, context) => {
    const createdAt = Date.parse(article.createdAt);
    const modifiedAt = Date.parse(article.modifiedAt);

    if (modifiedAt < createdAt) {
      context.addIssue({
        code: "custom",
        message: "modifiedAt must not be earlier than createdAt.",
        path: ["modifiedAt"],
      });
    }

    if (article.revision.updatedAt !== article.modifiedAt) {
      context.addIssue({
        code: "custom",
        message: "revision.updatedAt must equal modifiedAt.",
        path: ["revision", "updatedAt"],
      });
    }

    if (
      article.revision.number === 1 &&
      article.revision.previousNumber !== null
    ) {
      context.addIssue({
        code: "custom",
        message: "The first revision cannot reference a previous revision.",
        path: ["revision", "previousNumber"],
      });
    }

    if (
      article.revision.number > 1 &&
      article.revision.previousNumber !== article.revision.number - 1
    ) {
      context.addIssue({
        code: "custom",
        message: "previousNumber must identify the immediately prior revision.",
        path: ["revision", "previousNumber"],
      });
    }

    if (article.state === "published" && !article.publishedAt) {
      context.addIssue({
        code: "custom",
        message: "Published articles require publishedAt.",
        path: ["publishedAt"],
      });
    }

    if (article.state !== "published" && article.publishedAt !== null) {
      context.addIssue({
        code: "custom",
        message: "Only published articles may have publishedAt.",
        path: ["publishedAt"],
      });
    }
  });

export type Article = z.infer<typeof articleSchemaV1>;
export type ArticleState = z.infer<typeof articleStateSchema>;
export type AssetReference = z.infer<typeof assetReferenceSchema>;

export const editorialAssetSchemaV1 = z
  .object({
    schemaVersion: z.literal(ARTICLE_SCHEMA_VERSION),
    id: editorialIdSchema,
    articleId: editorialIdSchema,
    originalFileName: z.string().trim().min(1).max(255),
    contentType: z.enum(allowedAssetContentTypes),
    sizeBytes: z.number().int().positive().max(MAX_ASSET_BYTES),
    width: z.number().int().positive().max(MAX_ASSET_DIMENSION),
    height: z.number().int().positive().max(MAX_ASSET_DIMENSION),
    altText: z.string().trim().min(5).max(300),
    checksumSha256: z.string().regex(/^[a-f0-9]{64}$/),
    storagePath: z
      .string()
      .regex(/^articles\/[a-z0-9:_-]+\/[a-z0-9:_-]+\.(avif|jpe?g|png|webp)$/),
    deliveryUrl: z.string().url().startsWith("https://"),
    createdAt: isoDateTimeSchema,
    createdBy: editorialIdSchema,
  })
  .strict();

export type EditorialAsset = z.infer<typeof editorialAssetSchemaV1>;

export interface AssetUploadInput {
  altText: string;
  articleId: string;
  bytes: Uint8Array;
  contentType: string;
  createdAt: string;
  createdBy: string;
  fileName: string;
  id: string;
}

export const editorialExportSchemaV1 = z
  .object({
    schemaVersion: z.literal(EDITORIAL_EXPORT_VERSION),
    exportedAt: isoDateTimeSchema,
    articles: z.array(articleSchemaV1),
    assets: z.array(editorialAssetSchemaV1),
  })
  .strict();

export type EditorialExport = z.infer<typeof editorialExportSchemaV1>;

export function parseArticle(input: unknown): Article {
  const result = articleSchemaV1.safeParse(input);
  if (!result.success) {
    throw new EditorialValidationError("Article validation failed.", {
      issues: result.error.issues,
    });
  }
  return result.data;
}

export function parseEditorialAsset(input: unknown): EditorialAsset {
  const result = editorialAssetSchemaV1.safeParse(input);
  if (!result.success) {
    throw new EditorialValidationError("Asset record validation failed.", {
      issues: result.error.issues,
    });
  }
  return result.data;
}
