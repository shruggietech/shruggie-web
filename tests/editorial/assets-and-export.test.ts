import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  createEditorialExport,
  parseEditorialExport,
  serializeEditorialExport,
} from "../../lib/editorial/export";
import {
  AssetCollisionError,
  AssetValidationError,
  EditorialValidationError,
} from "../../lib/editorial/errors";
import {
  InMemoryArticleRepository,
  InMemoryAssetStore,
} from "../../lib/editorial/memory-adapter";
import { articleFixture, mutationContext } from "./fixtures";

async function pngBytes(): Promise<Buffer> {
  return sharp({
    create: {
      width: 2,
      height: 3,
      channels: 4,
      background: { r: 43, g: 204, b: 115, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
}

function uploadInput(bytes: Uint8Array, contentType = "image/png") {
  return {
    id: "asset:hero",
    articleId: "article:example",
    fileName: "hero.png",
    contentType,
    bytes,
    altText: "Green example image",
    createdAt: "2026-09-05T12:00:00.000Z",
    createdBy: "editor:natalie",
  };
}

describe("AssetStore contract", () => {
  it("inspects image bytes and creates a stable private delivery record", async () => {
    const store = new InMemoryAssetStore();
    const asset = await store.put(uploadInput(await pngBytes()));

    expect(asset).toMatchObject({
      contentType: "image/png",
      width: 2,
      height: 3,
      storagePath: "articles/article:example/asset:hero.png",
      deliveryUrl: "https://shruggie.tech/media/asset:hero",
    });
    expect(asset.checksumSha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects mismatched types and inadequate alternatives", async () => {
    const store = new InMemoryAssetStore();
    const bytes = await pngBytes();
    await expect(
      store.put(uploadInput(bytes, "image/jpeg")),
    ).rejects.toBeInstanceOf(AssetValidationError);
    await expect(
      store.put({ ...uploadInput(bytes), altText: "bad" }),
    ).rejects.toBeInstanceOf(AssetValidationError);
  });

  it("rejects stable asset ID collisions", async () => {
    const store = new InMemoryAssetStore();
    const input = uploadInput(await pngBytes());
    await store.put(input);
    await expect(store.put(input)).rejects.toBeInstanceOf(AssetCollisionError);
  });

  it("rejects asset IDs that could escape a provider document key", async () => {
    const store = new InMemoryAssetStore();
    await expect(store.getById("../../secret")).rejects.toBeInstanceOf(
      EditorialValidationError,
    );
  });

  it("round-trips every article field and asset reference through export", async () => {
    const articles = new InMemoryArticleRepository();
    const assets = new InMemoryAssetStore();
    const asset = await assets.put(uploadInput(await pngBytes()));
    const article = articleFixture({
      featuredImage: {
        assetId: asset.id,
        deliveryUrl: asset.deliveryUrl,
        altText: asset.altText,
      },
    });
    await articles.create({
      article,
      idempotencyKey: "create-example-0001",
      mutation: mutationContext(),
    });

    const snapshot = await createEditorialExport(
      articles,
      assets,
      "2026-09-05T14:00:00.000Z",
    );
    const restored = parseEditorialExport(serializeEditorialExport(snapshot));
    expect(restored).toEqual(snapshot);
    expect(restored.articles[0]).toEqual(article);
    expect(restored.assets[0]).toEqual(asset);
  });
});
