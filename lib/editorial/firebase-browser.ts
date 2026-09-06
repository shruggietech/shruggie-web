"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

function browserAuth() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };
  if (
    !config.apiKey ||
    !config.appId ||
    !config.authDomain ||
    !config.projectId
  ) {
    throw new Error("Firebase browser authentication is not configured.");
  }
  const app = getApps().length ? getApp() : initializeApp(config);
  return getAuth(app);
}

function googleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    hd: "shruggie.tech",
    prompt: "select_account",
  });
  return provider;
}

export async function startGoogleSignIn(): Promise<void> {
  const auth = browserAuth();
  await signInWithRedirect(auth, googleProvider());
}

export async function completeGoogleSignIn(): Promise<string | null> {
  const auth = browserAuth();
  const credential = await getRedirectResult(auth);
  if (!credential) return null;
  const idToken = await credential.user.getIdToken(true);
  await signOut(auth);
  return idToken;
}
