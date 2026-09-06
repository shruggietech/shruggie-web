"use client";

import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import Link from "next/link";

import {
  createEditorialSession,
  type EditorialEditor,
} from "@/lib/editorial/client-api";
import {
  completeGoogleSignIn,
  startGoogleSignIn,
} from "@/lib/editorial/firebase-browser";
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

  useEffect(() => {
    let active = true;
    completeGoogleSignIn()
      .then(async (idToken) => {
        if (!active || !idToken) return;
        setBusy(true);
        onSignedIn(await createEditorialSession(idToken));
      })
      .catch((caught) => {
        if (!active) return;
        setError(
          caught instanceof Error
            ? caught.message
            : "Google sign-in could not be completed.",
        );
        setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [onSignedIn]);

  async function signIn() {
    setBusy(true);
    setError(null);
    try {
      await startGoogleSignIn();
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Sign-in failed.";
      setError(message);
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
        {expired ? (
          "Sign in again to continue. Your unsaved changes are still here."
        ) : (
          <>
            This workspace is for pre-authorized use only. Interested in
            publishing to our blog?{" "}
            <Link
              href="/contact"
              className="text-accent underline decoration-current/40 underline-offset-4 hover:decoration-current"
            >
              Contact us.
            </Link>
          </>
        )}
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
        {busy ? "Redirecting to Google…" : "Continue with Google"}
      </Button>
    </section>
  );
}
