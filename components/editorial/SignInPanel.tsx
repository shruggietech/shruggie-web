"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

import {
  createEditorialSession,
  type EditorialEditor,
} from "@/lib/editorial/client-api";
import { getFreshGoogleIdToken } from "@/lib/editorial/firebase-browser";
import { Button } from "@/components/ui/Button";

interface SignInPanelProps {
  expired?: boolean;
  onSignedIn: (editor: EditorialEditor) => void;
}

export default function SignInPanel({
  expired = false,
  onSignedIn,
}: SignInPanelProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setBusy(true);
    setError(null);
    try {
      const idToken = await getFreshGoogleIdToken();
      onSignedIn(await createEditorialSession(idToken));
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Sign-in failed.";
      setError(
        message.includes("popup-closed")
          ? "The sign-in window was closed before authentication finished."
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="editorial-sign-in-heading"
      className="border-border bg-bg-elevated mx-auto max-w-xl rounded-2xl border p-6 shadow-xl md:p-10"
    >
      <div className="bg-green-bright-10 text-accent mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
        <LogIn aria-hidden="true" size={24} />
      </div>
      <p className="text-body-xs text-accent mb-2 font-mono font-medium tracking-[0.18em] uppercase">
        Staff workspace
      </p>
      <h1
        id="editorial-sign-in-heading"
        className="font-display text-display-sm font-bold"
      >
        {expired ? "Your session expired" : "Write for ShruggieTech"}
      </h1>
      <p className="text-body-md text-text-secondary mt-3">
        {expired
          ? "Sign in again to continue. Your unsaved changes are still here."
          : "Use an approved shruggie.tech Google account. Public registration is not available."}
      </p>
      {error && (
        <div
          role="alert"
          className="text-body-sm mt-5 rounded-lg border border-red-500/40 bg-red-500/10 p-4"
        >
          {error}
        </div>
      )}
      <Button
        type="button"
        onClick={signIn}
        disabled={busy}
        className="mt-7 w-full sm:w-auto"
      >
        {busy ? "Opening Google sign-in…" : "Continue with Google"}
      </Button>
    </section>
  );
}
