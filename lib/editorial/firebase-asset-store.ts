import "server-only";

import type { Bucket } from "@google-cloud/storage";
import type { Firestore } from "firebase-admin/firestore";

import { prepareAssetUpload } from "./assets";
import {
  editorialIdSchema,
  parseEditorialAsset,
  type AssetUploadInput,
  type EditorialAsset,
} from "./domain";
import { AssetCollisionError, EditorialValidationError } from "./errors";
import { mapFirebaseError, withEditorialTimeout } from "./firebase-errors";
import type { AssetStore } from "./ports";

const ASSETS = "assets";

function isPreconditionFailure(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  return [409, 412, "409", "412"].includes(
    (error as { code: string | number }).code,
  );
}

export class FirebaseAssetStore implements AssetStore {
  constructor(
    private readonly db: Firestore,
    private readonly bucket: Bucket,
    private readonly deliveryOrigin: string,
    private readonly timeoutMs = 10_000,
  ) {}

  async put(input: AssetUploadInput): Promise<EditorialAsset> {
    const prepared = await prepareAssetUpload(input, this.deliveryOrigin);
    const document = this.db.collection(ASSETS).doc(prepared.asset.id);
    const file = this.bucket.file(prepared.asset.storagePath);

    return withEditorialTimeout(
      "store an article image",
      this.timeoutMs,
      async () => {
        if ((await document.get()).exists) {
          throw new AssetCollisionError(prepared.asset.id);
        }

        try {
          await file.save(prepared.bytes, {
            resumable: false,
            validation: "crc32c",
            preconditionOpts: { ifGenerationMatch: 0 },
            metadata: {
              contentType: prepared.asset.contentType,
              cacheControl: "private, max-age=0, no-store",
              metadata: {
                articleId: prepared.asset.articleId,
                assetId: prepared.asset.id,
                checksumSha256: prepared.asset.checksumSha256,
              },
            },
          });
        } catch (error) {
          if (isPreconditionFailure(error)) {
            throw new AssetCollisionError(prepared.asset.id);
          }
          throw mapFirebaseError(
            error,
            "store an article image",
            this.timeoutMs,
          );
        }

        try {
          await document.create(prepared.asset);
        } catch (error) {
          await file.delete({ ignoreNotFound: true }).catch(() => undefined);
          if (isPreconditionFailure(error)) {
            throw new AssetCollisionError(prepared.asset.id);
          }
          throw error;
        }

        return prepared.asset;
      },
    );
  }

  async getById(id: string): Promise<EditorialAsset | null> {
    const parsedId = editorialIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new EditorialValidationError("Asset ID is invalid.", {
        issues: parsedId.error.issues,
      });
    }
    return withEditorialTimeout(
      "read an article image",
      this.timeoutMs,
      async () => {
        const snapshot = await this.db
          .collection(ASSETS)
          .doc(parsedId.data)
          .get();
        return snapshot.exists ? parseEditorialAsset(snapshot.data()) : null;
      },
    );
  }

  async exportAll(): Promise<EditorialAsset[]> {
    return withEditorialTimeout(
      "export article images",
      this.timeoutMs,
      async () => {
        const snapshot = await this.db
          .collection(ASSETS)
          .orderBy("__name__")
          .get();
        return snapshot.docs.map((document) =>
          parseEditorialAsset(document.data()),
        );
      },
    );
  }
}
