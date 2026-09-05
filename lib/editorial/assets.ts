import "server-only";

import { createHash } from "node:crypto";

import sharp, { type Metadata } from "sharp";

import {
  ARTICLE_SCHEMA_VERSION,
  allowedAssetContentTypes,
  editorialAssetSchemaV1,
  MAX_ASSET_BYTES,
  MAX_ASSET_DIMENSION,
  type AssetUploadInput,
  type EditorialAsset,
} from "./domain";
import { AssetValidationError } from "./errors";

const extensionByContentType: Readonly<Record<string, string>> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const contentTypeBySharpFormat: Readonly<Record<string, string>> = {
  avif: "image/avif",
  heif: "image/avif",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export interface PreparedAssetUpload {
  asset: EditorialAsset;
  bytes: Buffer;
}

export async function prepareAssetUpload(
  input: AssetUploadInput,
  deliveryOrigin: string,
): Promise<PreparedAssetUpload> {
  const bytes = Buffer.from(input.bytes);

  if (bytes.length === 0 || bytes.length > MAX_ASSET_BYTES) {
    throw new AssetValidationError(
      `Images must be between 1 byte and ${MAX_ASSET_BYTES} bytes.`,
      { actualBytes: bytes.length, maxBytes: MAX_ASSET_BYTES },
    );
  }

  if (
    !allowedAssetContentTypes.includes(
      input.contentType as (typeof allowedAssetContentTypes)[number],
    )
  ) {
    throw new AssetValidationError(
      `Unsupported image type: ${input.contentType}.`,
      { allowedContentTypes: allowedAssetContentTypes },
    );
  }

  let metadata: Metadata;
  try {
    metadata = await sharp(bytes, {
      failOn: "error",
      limitInputPixels: MAX_ASSET_DIMENSION * MAX_ASSET_DIMENSION,
    }).metadata();
  } catch (error) {
    throw new AssetValidationError(
      "The upload is not a valid supported image.",
      {
        cause: error instanceof Error ? error.message : "unknown",
      },
    );
  }

  const detectedContentType = metadata.format
    ? contentTypeBySharpFormat[metadata.format]
    : undefined;
  if (!detectedContentType || detectedContentType !== input.contentType) {
    throw new AssetValidationError(
      "The declared content type does not match the image bytes.",
      { declared: input.contentType, detected: detectedContentType },
    );
  }

  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width > MAX_ASSET_DIMENSION ||
    metadata.height > MAX_ASSET_DIMENSION
  ) {
    throw new AssetValidationError(
      `Image dimensions must not exceed ${MAX_ASSET_DIMENSION}px.`,
      { height: metadata.height, width: metadata.width },
    );
  }

  if ((metadata.pages ?? 1) > 1) {
    throw new AssetValidationError(
      "Animated or multi-page images are not supported.",
    );
  }

  let origin: URL;
  try {
    origin = new URL(deliveryOrigin);
  } catch {
    throw new AssetValidationError("The asset delivery origin is invalid.");
  }
  if (origin.protocol !== "https:") {
    throw new AssetValidationError("The asset delivery origin must use HTTPS.");
  }

  const extension = extensionByContentType[input.contentType];
  const storagePath = `articles/${input.articleId}/${input.id}.${extension}`;
  const deliveryUrl = new URL(`/media/${input.id}`, origin).toString();

  const result = editorialAssetSchemaV1.safeParse({
    schemaVersion: ARTICLE_SCHEMA_VERSION,
    id: input.id,
    articleId: input.articleId,
    originalFileName: input.fileName,
    contentType: input.contentType,
    sizeBytes: bytes.length,
    width: metadata.width,
    height: metadata.height,
    altText: input.altText,
    checksumSha256: createHash("sha256").update(bytes).digest("hex"),
    storagePath,
    deliveryUrl,
    createdAt: input.createdAt,
    createdBy: input.createdBy,
  });

  if (!result.success) {
    throw new AssetValidationError("Asset metadata validation failed.", {
      issues: result.error.issues,
    });
  }

  return { asset: result.data, bytes };
}
