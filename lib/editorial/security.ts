import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { z } from "zod";

import {
  editorialMutationContextSchema,
  type EditorialMutationContext,
  type EditorialRole,
} from "./audit";

export const EDITOR_SESSION_COOKIE = "__Host-shruggie_editor";
export const EDITOR_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;
const MAX_SIGN_IN_TOKEN_AGE_SECONDS = 5 * 60;

export type EditorialSecurityErrorCode =
  | "AUTH_UNAVAILABLE"
  | "INVALID_ORIGIN"
  | "INVALID_SESSION"
  | "STALE_SIGN_IN"
  | "UNAUTHENTICATED"
  | "UNAUTHORIZED";

export class EditorialSecurityError extends Error {
  constructor(
    readonly code: EditorialSecurityErrorCode,
    message: string,
    readonly status: 401 | 403 | 503,
    options: { cause?: unknown } = {},
  ) {
    super(message, options);
    this.name = "EditorialSecurityError";
  }
}

export interface VerifiedFirebaseIdentity {
  auth_time?: number;
  email?: string;
  email_verified?: boolean;
  uid: string;
}

export interface EditorialAuthVerifier {
  verifyIdToken(
    token: string,
    checkRevoked: boolean,
  ): Promise<VerifiedFirebaseIdentity>;
  verifySessionCookie(
    cookie: string,
    checkRevoked: boolean,
  ): Promise<VerifiedFirebaseIdentity>;
}

export interface EditorialSessionAuth extends EditorialAuthVerifier {
  createSessionCookie(
    token: string,
    options: { expiresIn: number },
  ): Promise<string>;
  revokeRefreshTokens(uid: string): Promise<void>;
}

export interface EditorialSecurityConfig {
  adminEmails: ReadonlySet<string>;
  canonicalOrigin: string;
  editorEmails: ReadonlySet<string>;
}

export interface EditorPrincipal {
  id: string;
  role: EditorialRole;
  uid: string;
}

const environmentSchema = z
  .object({
    CMS_ADMIN_EMAILS: z.string().optional().default(""),
    CMS_CANONICAL_ORIGIN: z.string().optional(),
    CMS_EDITOR_EMAILS: z.string().optional().default(""),
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
  })
  .strict();

const requestIdSchema = editorialMutationContextSchema.shape.requestId;

function parseEmailSet(value: string): ReadonlySet<string> {
  return new Set(
    value
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
      .map((email) => z.string().email().parse(email)),
  );
}

export function loadEditorialSecurityConfig(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): EditorialSecurityConfig {
  const parsed = environmentSchema.parse({
    CMS_ADMIN_EMAILS: environment.CMS_ADMIN_EMAILS,
    CMS_CANONICAL_ORIGIN: environment.CMS_CANONICAL_ORIGIN,
    CMS_EDITOR_EMAILS: environment.CMS_EDITOR_EMAILS,
    NEXT_PUBLIC_SITE_URL: environment.NEXT_PUBLIC_SITE_URL,
  });
  const canonical = new URL(
    parsed.CMS_CANONICAL_ORIGIN ?? parsed.NEXT_PUBLIC_SITE_URL,
  );
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(
    canonical.hostname,
  );
  if (
    canonical.protocol !== "https:" &&
    !(isLocal && canonical.protocol === "http:")
  ) {
    throw new Error(
      "The CMS canonical origin must use HTTPS outside localhost.",
    );
  }
  return {
    adminEmails: parseEmailSet(parsed.CMS_ADMIN_EMAILS),
    canonicalOrigin: canonical.origin,
    editorEmails: parseEmailSet(parsed.CMS_EDITOR_EMAILS),
  };
}

function firebaseErrorCode(error: unknown): string | undefined {
  return error && typeof error === "object" && "code" in error
    ? String((error as { code: unknown }).code)
    : undefined;
}

function mapFirebaseAuthError(error: unknown): EditorialSecurityError {
  const code = firebaseErrorCode(error);
  if (
    code &&
    [
      "auth/id-token-expired",
      "auth/id-token-revoked",
      "auth/invalid-id-token",
      "auth/session-cookie-expired",
      "auth/session-cookie-revoked",
      "auth/user-disabled",
      "auth/user-not-found",
    ].includes(code)
  ) {
    return new EditorialSecurityError(
      "INVALID_SESSION",
      "The editorial session is invalid or expired.",
      401,
      { cause: error },
    );
  }
  return new EditorialSecurityError(
    "AUTH_UNAVAILABLE",
    "Editorial authentication is temporarily unavailable.",
    503,
    { cause: error },
  );
}

export async function createEditorSessionCookie(
  token: string,
  auth: EditorialSessionAuth,
): Promise<string> {
  try {
    return await auth.createSessionCookie(token, {
      expiresIn: EDITOR_SESSION_MAX_AGE_MS,
    });
  } catch (error) {
    throw mapFirebaseAuthError(error);
  }
}

export async function revokeEditorSessions(
  uid: string,
  auth: EditorialSessionAuth,
): Promise<void> {
  try {
    await auth.revokeRefreshTokens(uid);
  } catch (error) {
    throw mapFirebaseAuthError(error);
  }
}

function principalId(uid: string): string {
  const digest = createHash("sha256").update(uid).digest("hex").slice(0, 32);
  return `editor:${digest}`;
}

export function authorizeEditorIdentity(
  identity: VerifiedFirebaseIdentity,
  config: EditorialSecurityConfig,
): EditorPrincipal {
  const email = identity.email?.trim().toLowerCase();
  if (!identity.uid || !email || identity.email_verified !== true) {
    throw new EditorialSecurityError(
      "UNAUTHORIZED",
      "A verified, approved staff account is required.",
      403,
    );
  }
  const role = config.adminEmails.has(email)
    ? "admin"
    : config.editorEmails.has(email)
      ? "editor"
      : null;
  if (!role) {
    throw new EditorialSecurityError(
      "UNAUTHORIZED",
      "This account is not approved for editorial access.",
      403,
    );
  }
  return { id: principalId(identity.uid), role, uid: identity.uid };
}

export async function verifyEditorIdToken(
  token: string,
  verifier: EditorialAuthVerifier,
  config: EditorialSecurityConfig,
  nowSeconds = Math.floor(Date.now() / 1000),
): Promise<EditorPrincipal> {
  if (!token.trim()) {
    throw new EditorialSecurityError(
      "UNAUTHENTICATED",
      "A Firebase ID token is required.",
      401,
    );
  }
  let identity: VerifiedFirebaseIdentity;
  try {
    identity = await verifier.verifyIdToken(token, true);
  } catch (error) {
    throw mapFirebaseAuthError(error);
  }
  if (
    typeof identity.auth_time !== "number" ||
    nowSeconds - identity.auth_time > MAX_SIGN_IN_TOKEN_AGE_SECONDS ||
    identity.auth_time > nowSeconds + 30
  ) {
    throw new EditorialSecurityError(
      "STALE_SIGN_IN",
      "Sign in again before starting an editorial session.",
      401,
    );
  }
  return authorizeEditorIdentity(identity, config);
}

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return null;
}

export async function verifyEditorSession(
  cookieHeader: string | null,
  verifier: EditorialAuthVerifier,
  config: EditorialSecurityConfig,
): Promise<EditorPrincipal> {
  const sessionCookie = readCookie(cookieHeader, EDITOR_SESSION_COOKIE);
  if (!sessionCookie) {
    throw new EditorialSecurityError(
      "UNAUTHENTICATED",
      "An editorial session is required.",
      401,
    );
  }
  try {
    const identity = await verifier.verifySessionCookie(sessionCookie, true);
    return authorizeEditorIdentity(identity, config);
  } catch (error) {
    if (error instanceof EditorialSecurityError) throw error;
    throw mapFirebaseAuthError(error);
  }
}

export function assertCanonicalMutationOrigin(
  originHeader: string | null,
  canonicalOrigin: string,
): void {
  if (!originHeader) {
    throw new EditorialSecurityError(
      "INVALID_ORIGIN",
      "Mutation requests require a canonical Origin header.",
      403,
    );
  }
  let origin: string;
  try {
    origin = new URL(originHeader).origin;
  } catch {
    throw new EditorialSecurityError(
      "INVALID_ORIGIN",
      "The request origin is invalid.",
      403,
    );
  }
  if (origin !== canonicalOrigin) {
    throw new EditorialSecurityError(
      "INVALID_ORIGIN",
      "Cross-origin editorial mutations are not allowed.",
      403,
    );
  }
}

export function mutationContextFor(
  principal: EditorPrincipal,
  requestIdHeader: string | null,
): EditorialMutationContext {
  const candidate = requestIdHeader ?? `request:${randomUUID()}`;
  const requestId = requestIdSchema.safeParse(candidate);
  return {
    actorId: principal.id,
    requestId: requestId.success ? requestId.data : `request:${randomUUID()}`,
    role: principal.role,
  };
}

export function requireEditorialRole(
  principal: EditorPrincipal,
  requiredRole: EditorialRole,
): void {
  if (requiredRole === "editor" || principal.role === "admin") return;
  throw new EditorialSecurityError(
    "UNAUTHORIZED",
    "This editorial action requires an administrator.",
    403,
  );
}

export function serializeEditorSessionCookie(
  value: string,
  maxAgeSeconds: number,
): string {
  return `${EDITOR_SESSION_COOKIE}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

export function clearEditorSessionCookie(): string {
  return `${EDITOR_SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`;
}
