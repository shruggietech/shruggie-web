import sharp from "sharp";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { deleteApp, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { FirebaseAssetStore } from "../../lib/editorial/firebase-asset-store";
import { FirestoreArticleRepository } from "../../lib/editorial/firestore-article-repository";
import {
  RevisionConflictError,
  SlugCollisionError,
} from "../../lib/editorial/errors";
import { articleFixture, nextRevision } from "./fixtures";

const projectId = "demo-shruggie-web";
const bucketName = `${projectId}.firebasestorage.app`;

let app: App;
let db: Firestore;

beforeAll(() => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error("Run this test through npm run test:integration.");
  }
  app = initializeApp(
    { projectId, storageBucket: bucketName },
    "editorial-test",
  );
  db = getFirestore(app);
});

afterEach(async () => {
  const collections = await db.listCollections();
  await Promise.all(
    collections.map((collection) => db.recursiveDelete(collection)),
  );
  await getStorage(app)
    .bucket(bucketName)
    .deleteFiles({ force: true })
    .catch(() => undefined);
});

afterAll(async () => {
  await deleteApp(app);
});

describe("Firebase editorial adapters", () => {
  it("enforces slug reservations, optimistic revisions, and visibility", async () => {
    const repository = new FirestoreArticleRepository(db);
    const draft = articleFixture();
    await repository.create({
      article: draft,
      idempotencyKey: "firebase-create-0001",
    });

    await expect(
      repository.create({
        article: articleFixture({ id: "article:collision" }),
        idempotencyKey: "firebase-create-0002",
      }),
    ).rejects.toBeInstanceOf(SlugCollisionError);
    await expect(
      repository.getBySlug(draft.slug, "published"),
    ).resolves.toBeNull();

    const published = nextRevision(draft, {
      state: "published",
      publishedAt: "2026-09-05T13:00:00.000Z",
    });
    await expect(
      repository.update({
        article: published,
        expectedRevision: 0,
        idempotencyKey: "firebase-update-0001",
      }),
    ).rejects.toBeInstanceOf(RevisionConflictError);
    await repository.update({
      article: published,
      expectedRevision: 1,
      idempotencyKey: "firebase-update-0002",
    });

    await expect(
      repository.getBySlug(draft.slug, "published"),
    ).resolves.toEqual(published);
    await expect(repository.exportAll()).resolves.toEqual([published]);
  });

  it("stores validated image bytes privately and exports their records", async () => {
    const bytes = await sharp({
      create: {
        width: 4,
        height: 5,
        channels: 4,
        background: { r: 43, g: 204, b: 115, alpha: 1 },
      },
    })
      .webp()
      .toBuffer();
    const store = new FirebaseAssetStore(
      db,
      getStorage(app).bucket(bucketName),
      "https://shruggie.tech",
    );
    const asset = await store.put({
      id: "asset:firebase-hero",
      articleId: "article:example",
      fileName: "hero.webp",
      contentType: "image/webp",
      bytes,
      altText: "Green Firebase integration image",
      createdAt: "2026-09-05T12:00:00.000Z",
      createdBy: "editor:natalie",
    });

    await expect(store.getById(asset.id)).resolves.toEqual(asset);
    await expect(store.exportAll()).resolves.toEqual([asset]);
    const [exists] = await getStorage(app)
      .bucket(bucketName)
      .file(asset.storagePath)
      .exists();
    expect(exists).toBe(true);
  });
});
