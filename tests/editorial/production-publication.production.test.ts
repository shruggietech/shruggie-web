import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createServer } from "node:net";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { deleteApp, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import { FirestoreArticleRepository } from "../../lib/editorial/firestore-article-repository";
import {
  EDITOR_SESSION_COOKIE,
  createEditorSessionCookie,
  verifyEditorIdToken,
} from "../../lib/editorial/security";
import type { Article } from "../../lib/editorial/domain";
import { articleFixture, nextRevision } from "./fixtures";

const projectId = "demo-shruggie-web";
const editorEmail = "publication-test@shruggie.tech";

let app: App;
let baseUrl: string;
let editorCookie: string;
let editorId: string;
let server: ChildProcessWithoutNullStreams;
let serverOutput = "";

async function availablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const listener = createServer();
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", () => {
      const address = listener.address();
      const port = typeof address === "object" && address ? address.port : 0;
      listener.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Next.js did not start in time.\n${serverOutput}`);
}

async function waitForContent(
  path: string,
  expected: string,
  present = true,
): Promise<Response> {
  const deadline = Date.now() + 15_000;
  let response = new Response(null, { status: 503 });
  while (Date.now() < deadline) {
    response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    const content = await response.text();
    if (content.includes(expected) === present) return response;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(
    `${path} did not ${present ? "include" : "remove"} ${expected}. Last status: ${response.status}\n${serverOutput}`,
  );
}

function mutationRequest(
  article: Article,
  input: {
    expectedRevision: number;
    idempotencyKey: string;
    restoreFromRevision?: number;
  },
) {
  return fetch(`${baseUrl}/api/admin/articles/${article.id}`, {
    body: JSON.stringify({ article, ...input }),
    headers: {
      "Content-Type": "application/json",
      Cookie: `${EDITOR_SESSION_COOKIE}=${encodeURIComponent(editorCookie)}`,
      Origin: baseUrl,
      "X-Request-Id": `request:${input.idempotencyKey}`,
    },
    method: "PUT",
  });
}

function restoredRevision(
  current: Article,
  source: Article,
  modifiedAt: string,
): Article {
  return nextRevision(current, {
    author: source.author,
    body: source.body,
    category: source.category,
    excerpt: source.excerpt,
    featuredImage: source.featuredImage,
    modifiedAt,
    ogImage: source.ogImage,
    publishedAt: current.publishedAt,
    slug: source.slug,
    state: current.state,
    title: source.title,
    revision: {
      number: current.revision.number + 1,
      previousNumber: current.revision.number,
      updatedAt: modifiedAt,
      updatedBy: editorId,
    },
  });
}

beforeAll(async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error(
      "Run this test through npm run test:production-publication.",
    );
  }
  app = initializeApp({ projectId }, "production-publication-test");
  const auth = getAuth(app);
  const user = await auth.createUser({
    email: editorEmail,
    emailVerified: true,
    uid: "production-publication-editor",
  });
  const customToken = await auth.createCustomToken(user.uid);
  const signIn = await fetch(
    `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=demo-key`,
    {
      body: JSON.stringify({ returnSecureToken: true, token: customToken }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );
  const { idToken } = (await signIn.json()) as { idToken: string };
  const principal = await verifyEditorIdToken(idToken, auth, {
    adminEmails: new Set(),
    canonicalOrigin: "http://127.0.0.1",
    editorEmails: new Set([editorEmail]),
  });
  editorId = principal.id;
  editorCookie = await createEditorSessionCookie(idToken, auth);

  const port = await availablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  const executable = process.platform === "win32" ? "node.exe" : "node";
  server = spawn(
    executable,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        CMS_CANONICAL_ORIGIN: baseUrl,
        CMS_EDITOR_EMAILS: editorEmail,
        FIREBASE_PROJECT_ID: projectId,
        FIREBASE_STORAGE_BUCKET: `${projectId}.firebasestorage.app`,
        NEXT_PUBLIC_SITE_URL: "https://shruggie.tech",
      },
      windowsHide: true,
    },
  );
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  await waitForServer();
});

afterAll(async () => {
  server?.kill();
  if (app) await deleteApp(app);
});

describe("production publication lifecycle", () => {
  it("publishes, retries, updates, restores, and unpublishes a post-build slug", async () => {
    const repository = new FirestoreArticleRepository(getFirestore(app));
    const draft = articleFixture({
      id: "article:post-build-publication",
      slug: "post-build-publication",
      title: "Published after the production build",
      revision: {
        number: 1,
        previousNumber: null,
        updatedAt: "2026-09-10T12:00:00.000Z",
        updatedBy: editorId,
      },
    });
    await repository.create({
      article: draft,
      idempotencyKey: "production-create-0001",
      mutation: {
        actorId: editorId,
        requestId: "request:production-create-0001",
        role: "editor",
      },
    });
    const isolatedDraft = await fetch(`${baseUrl}/blog/${draft.slug}`, {
      cache: "no-store",
    });
    expect(isolatedDraft.status).toBe(404);
    await waitForContent("/blog", draft.title, false);

    const published = nextRevision(draft, {
      modifiedAt: "2026-09-10T13:00:00.000Z",
      publishedAt: "2026-09-10T13:00:00.000Z",
      state: "published",
      revision: {
        number: 2,
        previousNumber: 1,
        updatedAt: "2026-09-10T13:00:00.000Z",
        updatedBy: editorId,
      },
    });
    const rejectedPublish = await mutationRequest(published, {
      expectedRevision: 99,
      idempotencyKey: "production-rejected-publish-0001",
    });
    expect(rejectedPublish.status).toBe(409);
    await expect(repository.listRevisions(draft.id)).resolves.toHaveLength(1);

    const publishInput = {
      expectedRevision: 1,
      idempotencyKey: "production-publish-0001",
    };
    const publish = await mutationRequest(published, publishInput);
    expect(publish.status).toBe(200);
    expect((await publish.json()).publicationConverged).toBe(true);

    const replay = await mutationRequest(published, publishInput);
    expect(replay.status).toBe(200);
    expect((await replay.json()).article.revision.number).toBe(2);
    await expect(repository.listRevisions(draft.id)).resolves.toHaveLength(2);

    const articleResponse = await waitForContent(
      `/blog/${draft.slug}`,
      published.title,
    );
    expect(articleResponse.status).toBe(200);
    await waitForContent("/blog", published.title);
    await waitForContent("/sitemap.xml", `/blog/${draft.slug}`);

    const updated = nextRevision(published, {
      modifiedAt: "2026-09-10T14:00:00.000Z",
      title: "Updated without a deployment",
      revision: {
        number: 3,
        previousNumber: 2,
        updatedAt: "2026-09-10T14:00:00.000Z",
        updatedBy: editorId,
      },
    });
    expect(
      (
        await mutationRequest(updated, {
          expectedRevision: 2,
          idempotencyKey: "production-update-0001",
        })
      ).status,
    ).toBe(200);
    await waitForContent(`/blog/${draft.slug}`, updated.title);

    const restored = restoredRevision(
      updated,
      published,
      "2026-09-10T15:00:00.000Z",
    );
    expect(
      (
        await mutationRequest(restored, {
          expectedRevision: 3,
          idempotencyKey: "production-restore-0001",
          restoreFromRevision: 2,
        })
      ).status,
    ).toBe(200);
    await waitForContent(`/blog/${draft.slug}`, published.title);

    const unpublished = nextRevision(restored, {
      modifiedAt: "2026-09-10T16:00:00.000Z",
      publishedAt: null,
      state: "draft",
      revision: {
        number: 5,
        previousNumber: 4,
        updatedAt: "2026-09-10T16:00:00.000Z",
        updatedBy: editorId,
      },
    });
    expect(
      (
        await mutationRequest(unpublished, {
          expectedRevision: 4,
          idempotencyKey: "production-unpublish-0001",
        })
      ).status,
    ).toBe(200);
    const missing = await fetch(`${baseUrl}/blog/${draft.slug}`, {
      cache: "no-store",
    });
    expect(missing.status).toBe(404);
    await waitForContent("/blog", published.title, false);
    await waitForContent("/sitemap.xml", `/blog/${draft.slug}`, false);

    const audit = await repository.exportAudit();
    expect(audit.map((event) => event.action)).toEqual(
      expect.arrayContaining([
        "create",
        "publish",
        "edit",
        "restore",
        "unpublish",
      ]),
    );
  });
});
