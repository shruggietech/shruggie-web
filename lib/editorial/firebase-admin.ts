import "server-only";

import {
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
import { z } from "zod";

import { FirebaseAssetStore } from "./firebase-asset-store";
import { FirestoreArticleRepository } from "./firestore-article-repository";
import { createVercelGoogleCredential } from "./vercel-google-credential";

const environmentSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().startsWith("https://"),
});

function firebaseAdminApp(): App {
  if (getApps().length > 0) return getApp();

  const environment = environmentSchema.parse({
    FIREBASE_PROJECT_ID:
      process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
  const usesEmulator = Boolean(
    process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FIREBASE_STORAGE_EMULATOR_HOST,
  );
  const credential = usesEmulator
    ? undefined
    : process.env.VERCEL === "1"
      ? createVercelGoogleCredential()
      : applicationDefault();

  return initializeApp({
    projectId: environment.FIREBASE_PROJECT_ID,
    storageBucket: environment.FIREBASE_STORAGE_BUCKET,
    ...(credential ? { credential } : {}),
  });
}

export function createFirebaseEditorialBackend() {
  const environment = environmentSchema.parse({
    FIREBASE_PROJECT_ID:
      process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
  const app = firebaseAdminApp();
  const db = getFirestore(app);
  const bucket = getStorage(app).bucket(environment.FIREBASE_STORAGE_BUCKET);

  return {
    articles: new FirestoreArticleRepository(db),
    assets: new FirebaseAssetStore(
      db,
      bucket,
      environment.NEXT_PUBLIC_SITE_URL,
    ),
  };
}

export function getFirebaseEditorialAuth() {
  return getAuth(firebaseAdminApp());
}
