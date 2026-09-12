"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Clock3,
  FilePlus2,
  Eye,
  ImagePlus,
  Images,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  articleForSave,
  createBlankArticle,
  slugFromTitle,
  validateArticleForSave,
  type ArticleFieldErrors,
} from "@/lib/editorial/article-form";
import {
  createEditorialArticle,
  deleteEditorialSession,
  editorialMutationKey,
  EditorialApiError,
  getEditorialArticle,
  getEditorialSession,
  listArticleRevisions,
  listEditorialArticles,
  listEditorialAssets,
  updateEditorialArticle,
  uploadEditorialAsset,
  type EditorialEditor,
} from "@/lib/editorial/client-api";
import type {
  Article,
  AssetReference,
  EditorialAsset,
} from "@/lib/editorial/domain";
import { TEAM_AUTHORS, getAuthorByReference } from "@/lib/team";
import { inspectMarkdown } from "@/lib/editorial/markdown-policy";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import MarkdownEditor from "./MarkdownEditor";
import SignInPanel from "./SignInPanel";

type LoadState = "idle" | "loading" | "ready" | "error";
type AssetSlot = "featuredImage" | "ogImage";
type MutationAction = "publish" | "restore" | "save" | "unpublish";
type EditorAction = MutationAction | "preview";

interface PendingArticleMutation {
  action: MutationAction;
  article: Article;
  expectedRevision: number | null;
  idempotencyKey: string;
  restoreFromRevision?: number;
}

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-bg-primary px-3 py-2.5 text-text-primary shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "block font-medium text-text-primary";
const DRAFT_RECOVERY_KEY = "shruggie:editorial-draft-recovery";

interface DraftRecovery {
  draft: Article;
  persisted: Article | null;
}

function readDraftRecovery(): DraftRecovery | null {
  try {
    const value = JSON.parse(
      sessionStorage.getItem(DRAFT_RECOVERY_KEY) ?? "null",
    ) as DraftRecovery | null;
    if (
      !value?.draft ||
      typeof value.draft.id !== "string" ||
      typeof value.draft.body?.source !== "string"
    ) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

function clearDraftRecovery(): void {
  sessionStorage.removeItem(DRAFT_RECOVERY_KEY);
}

function isSessionError(error: unknown): boolean {
  return (
    error instanceof EditorialApiError && [401, 403].includes(error.status)
  );
}

function friendlyError(error: unknown): string {
  if (error instanceof EditorialApiError) return error.message;
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function articleAssetReference(asset: EditorialAsset): AssetReference {
  return {
    assetId: asset.id,
    deliveryUrl: asset.deliveryUrl,
    altText: asset.altText,
  };
}

function stateLabel(state: Article["state"]): string {
  return state.charAt(0).toUpperCase() + state.slice(1);
}

function reservePreviewTab(): Window | null {
  const previewTab = window.open("about:blank", "_blank");
  if (previewTab) previewTab.opener = null;
  return previewTab;
}

function navigatePreviewTab(previewTab: Window | null, url: string): void {
  if (previewTab && !previewTab.closed) {
    previewTab.location.replace(url);
    return;
  }
  window.open(url, "_self");
}

export default function EditorialWorkspace() {
  const [editor, setEditor] = useState<EditorialEditor | null>(null);
  const [sessionState, setSessionState] = useState<LoadState>("loading");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [assets, setAssets] = useState<EditorialAsset[]>([]);
  const [listState, setListState] = useState<LoadState>("idle");
  const [listError, setListError] = useState<string | null>(null);
  const [persisted, setPersisted] = useState<Article | null>(null);
  const [draft, setDraft] = useState<Article | null>(null);
  const [dirty, setDirty] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const signedIn = useCallback((nextEditor: EditorialEditor) => {
    const recovery = readDraftRecovery();
    setEditor(nextEditor);
    setSessionExpired(false);
    setSessionState("ready");
    setListState("idle");
    if (recovery) {
      setPersisted(recovery.persisted);
      setDraft(recovery.draft);
      setDirty(true);
    }
  }, []);

  const handleSessionFailure = useCallback((error: unknown) => {
    if (isSessionError(error)) {
      setSessionExpired(true);
      setSessionState("error");
      return true;
    }
    return false;
  }, []);

  const loadWorkspace = useCallback(async () => {
    setListState("loading");
    setListError(null);
    try {
      const [nextArticles, nextAssets] = await Promise.all([
        listEditorialArticles(),
        listEditorialAssets(),
      ]);
      setArticles(nextArticles);
      setAssets(nextAssets);
      setListState("ready");
    } catch (error) {
      if (!handleSessionFailure(error)) {
        setListError(friendlyError(error));
        setListState("error");
      }
    }
  }, [handleSessionFailure]);

  useEffect(() => {
    let active = true;
    getEditorialSession()
      .then((nextEditor) => {
        if (!active) return;
        signedIn(nextEditor);
      })
      .catch((error) => {
        if (!active) return;
        setSessionState(isSessionError(error) ? "idle" : "error");
      });
    return () => {
      active = false;
    };
  }, [signedIn]);

  useEffect(() => {
    if (editor && sessionState === "ready" && listState === "idle") {
      void loadWorkspace();
    }
  }, [editor, listState, loadWorkspace, sessionState]);

  useEffect(() => {
    if (draft && dirty) {
      sessionStorage.setItem(
        DRAFT_RECOVERY_KEY,
        JSON.stringify({ draft, persisted } satisfies DraftRecovery),
      );
    }
  }, [dirty, draft, persisted]);

  async function signOut() {
    try {
      await deleteEditorialSession();
    } finally {
      clearDraftRecovery();
      setEditor(null);
      setSessionState("idle");
      setArticles([]);
      setAssets([]);
      setPersisted(null);
      setDraft(null);
      setDirty(false);
      setListState("idle");
    }
  }

  function beginNewArticle() {
    if (!editor) return;
    clearDraftRecovery();
    setPersisted(null);
    setDraft(createBlankArticle(editor.id, editor.author));
    setDirty(false);
    setConfirmDiscard(false);
  }

  function editArticle(article: Article) {
    clearDraftRecovery();
    setPersisted(article);
    setDraft(structuredClone(article));
    setDirty(false);
    setConfirmDiscard(false);
  }

  function closeEditor() {
    if (dirty && !confirmDiscard) {
      setConfirmDiscard(true);
      return;
    }
    setPersisted(null);
    setDraft(null);
    setDirty(false);
    setConfirmDiscard(false);
    clearDraftRecovery();
  }

  if (sessionState === "loading") {
    return <LoadingPanel label="Checking your staff session…" />;
  }

  if (!editor && sessionState === "idle") {
    return <SignInPanel onSignedIn={signedIn} />;
  }

  if (!editor && sessionState === "error") {
    return (
      <div className="space-y-4">
        <div
          role="alert"
          className="mx-auto max-w-xl rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
        >
          Authentication is temporarily unavailable. Your account has not been
          changed.
        </div>
        <SignInPanel onSignedIn={signedIn} />
      </div>
    );
  }

  return (
    <div className="relative">
      {sessionExpired && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bg-black/75 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Session expired"
        >
          <div className="mx-auto mt-16 max-w-xl">
            <SignInPanel expired onSignedIn={signedIn} />
          </div>
        </div>
      )}
      <header className="border-border mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-body-xs text-accent font-mono tracking-[0.18em] uppercase">
            Editorial
          </p>
          <h1 className="font-display text-display-sm mt-2 font-bold">
            Article workspace
          </h1>
          <p className="text-body-sm text-text-secondary mt-2">
            Signed in as{" "}
            <span className="text-text-primary font-medium">
              {editor?.role}
            </span>
          </p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={signOut}>
          <LogOut aria-hidden="true" className="mr-2" size={16} /> Sign out
        </Button>
      </header>

      {draft ? (
        <ArticleEditor
          editor={editor!}
          persisted={persisted}
          draft={draft}
          assets={assets}
          dirty={dirty}
          confirmDiscard={confirmDiscard}
          onChange={(next) => {
            setDraft(next);
            setDirty(true);
            setConfirmDiscard(false);
          }}
          onClose={closeEditor}
          onSaved={(saved) => {
            clearDraftRecovery();
            setPersisted(saved);
            setDraft(structuredClone(saved));
            setDirty(false);
            setArticles((current) => [
              saved,
              ...current.filter((item) => item.id !== saved.id),
            ]);
          }}
          onAsset={(asset) => setAssets((current) => [asset, ...current])}
          onSessionFailure={handleSessionFailure}
        />
      ) : (
        <ArticleDashboard
          articles={articles}
          state={listState}
          error={listError}
          onCreate={beginNewArticle}
          onEdit={editArticle}
          onRetry={loadWorkspace}
        />
      )}
    </div>
  );
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="text-text-secondary flex min-h-64 items-center justify-center gap-3"
    >
      <LoaderCircle
        aria-hidden="true"
        className="animate-spin motion-reduce:animate-none"
      />
      <span>{label}</span>
    </div>
  );
}

function ArticleDashboard({
  articles,
  state,
  error,
  onCreate,
  onEdit,
  onRetry,
}: {
  articles: Article[];
  state: LoadState;
  error: string | null;
  onCreate: () => void;
  onEdit: (article: Article) => void;
  onRetry: () => void;
}) {
  if (state === "loading" || state === "idle")
    return <LoadingPanel label="Loading articles…" />;
  if (state === "error") {
    return (
      <Card hover={false} role="alert" className="text-center">
        <AlertTriangle aria-hidden="true" className="mx-auto text-amber-500" />
        <h2 className="font-display mt-4 text-xl font-bold">
          Articles could not be loaded
        </h2>
        <p className="text-text-secondary mt-2">{error}</p>
        <Button type="button" onClick={onRetry} className="mt-6">
          <RefreshCw aria-hidden="true" className="mr-2" size={16} /> Retry
        </Button>
      </Card>
    );
  }
  return (
    <section aria-labelledby="articles-heading">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="articles-heading" className="font-display text-2xl font-bold">
            Articles
          </h2>
          <p className="text-body-sm text-text-secondary mt-1">
            Draft saving does not publish to the public site.
          </p>
        </div>
        <Button type="button" onClick={onCreate}>
          <FilePlus2 aria-hidden="true" className="mr-2" size={18} /> New
          article
        </Button>
      </div>
      {articles.length === 0 ? (
        <Card hover={false} className="border-dashed text-center">
          <h3 className="font-display text-xl font-bold">No articles yet</h3>
        </Card>
      ) : (
        <ul className="grid gap-4" aria-label="Editorial articles">
          {articles.map((article) => (
            <li key={article.id}>
              <button
                type="button"
                onClick={() => onEdit(article)}
                className="border-border bg-bg-elevated hover:border-accent focus-visible:outline-focus w-full rounded-xl border p-5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
                aria-label={`Edit ${article.title}, ${stateLabel(article.state)}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      {article.title}
                    </h3>
                    <p className="text-body-xs text-text-secondary mt-1 font-mono">
                      /{article.slug}
                    </p>
                  </div>
                  <span className="border-border text-body-xs w-fit rounded-full border px-3 py-1 font-medium">
                    {stateLabel(article.state)}
                  </span>
                </div>
                <p className="text-body-sm text-text-secondary mt-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <p className="text-body-xs text-text-muted mt-3">
                  Revision {article.revision.number} · Updated{" "}
                  {new Date(article.modifiedAt).toLocaleString()}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ArticleEditor({
  editor,
  persisted,
  draft,
  assets,
  dirty,
  confirmDiscard,
  onChange,
  onClose,
  onSaved,
  onAsset,
  onSessionFailure,
}: {
  editor: EditorialEditor;
  persisted: Article | null;
  draft: Article;
  assets: EditorialAsset[];
  dirty: boolean;
  confirmDiscard: boolean;
  onChange: (article: Article) => void;
  onClose: () => void;
  onSaved: (article: Article) => void;
  onAsset: (asset: EditorialAsset) => void;
  onSessionFailure: (error: unknown) => boolean;
}) {
  const [errors, setErrors] = useState<ArticleFieldErrors>({});
  const [activeAction, setActiveAction] = useState<EditorAction | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<Article[]>([]);
  const [revisionState, setRevisionState] = useState<LoadState>(
    persisted ? "loading" : "ready",
  );
  const [selectedRevision, setSelectedRevision] = useState<number | null>(null);
  const [restoreFromRevision, setRestoreFromRevision] = useState<number | null>(
    null,
  );
  const [pendingMutation, setPendingMutation] =
    useState<PendingArticleMutation | null>(null);
  const actionLockRef = useRef(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const readOnly = draft.state === "archived";
  const markdownIssues = useMemo(
    () => inspectMarkdown(draft.body.source),
    [draft.body.source],
  );

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const loadRevisions = useCallback(async () => {
    if (!persisted) return;
    try {
      setRevisions(await listArticleRevisions(persisted.id));
      setRevisionState("ready");
    } catch (error) {
      if (!onSessionFailure(error)) setRevisionState("error");
    }
  }, [onSessionFailure, persisted]);

  useEffect(() => {
    if (!persisted) return;
    let active = true;
    listArticleRevisions(persisted.id)
      .then((nextRevisions) => {
        if (!active) return;
        setRevisions(nextRevisions);
        setRevisionState("ready");
      })
      .catch((error) => {
        if (!active) return;
        if (!onSessionFailure(error)) setRevisionState("error");
      });
    return () => {
      active = false;
    };
  }, [onSessionFailure, persisted]);

  function applyChange(next: Article) {
    setPendingMutation(null);
    setRestoreFromRevision(null);
    onChange(next);
  }

  function field(path: string, value: string) {
    const next = structuredClone(draft);
    if (path === "title") next.title = value;
    if (path === "slug") next.slug = value;
    if (path === "excerpt") next.excerpt = value;
    if (path === "category") next.category = value;
    if (path === "body.source") next.body.source = value;
    applyChange(next);
    setErrors((current) => {
      const updated = { ...current };
      delete updated[path];
      return updated;
    });
    setMessage(null);
  }

  function selectAuthor(authorId: string) {
    const author = TEAM_AUTHORS.find((candidate) => candidate.id === authorId);
    if (!author) return;
    const next = structuredClone(draft);
    next.author = { ...author };
    applyChange(next);
    setErrors((current) => {
      const updated = { ...current };
      delete updated["author.name"];
      return updated;
    });
    setMessage(null);
  }

  function setAsset(slot: AssetSlot, assetId: string) {
    const next = structuredClone(draft);
    const asset = assets.find((item) => item.id === assetId);
    next[slot] = asset ? articleAssetReference(asset) : null;
    applyChange(next);
  }

  function setAssetAlt(slot: AssetSlot, altText: string) {
    const next = structuredClone(draft);
    if (next[slot]) next[slot] = { ...next[slot], altText };
    applyChange(next);
  }

  async function persistArticle(
    action: MutationAction,
    sourceDraft = draft,
    basePersisted = persisted,
    progressMessage?: string,
    failureLabel = "Save",
  ): Promise<Article | null> {
    const targetState =
      action === "publish"
        ? "published"
        : action === "unpublish" || action === "restore"
          ? "draft"
          : basePersisted?.state === "published"
            ? "published"
            : "draft";
    const reusable =
      pendingMutation?.action === action ? pendingMutation : null;
    const candidate =
      reusable?.article ??
      articleForSave(
        sourceDraft,
        editor.id,
        basePersisted,
        new Date(),
        targetState,
      );
    const nextErrors = validateArticleForSave(candidate);
    setErrors(nextErrors);
    setConflict(null);
    if (Object.keys(nextErrors).length) {
      setMessage(
        "Review the highlighted fields. Your unsaved work has been preserved.",
      );
      const firstField = Object.keys(nextErrors).find(
        (path) => path !== "form",
      );
      if (firstField) document.getElementById(firstField)?.focus();
      return null;
    }
    setMessage(progressMessage ?? "Saving…");
    const mutation: PendingArticleMutation = reusable ?? {
      action,
      article: candidate,
      expectedRevision: basePersisted?.revision.number ?? null,
      idempotencyKey: editorialMutationKey(action),
      ...(restoreFromRevision === null ? {} : { restoreFromRevision }),
    };
    setPendingMutation(mutation);
    try {
      const saved =
        mutation.expectedRevision === null
          ? await createEditorialArticle(
              mutation.article,
              mutation.idempotencyKey,
            )
          : await updateEditorialArticle(
              mutation.article,
              mutation.expectedRevision,
              {
                idempotencyKey: mutation.idempotencyKey,
                restoreFromRevision: mutation.restoreFromRevision,
              },
            );
      onSaved(saved);
      setMessage(
        mutation.restoreFromRevision !== undefined
          ? `Revision ${mutation.restoreFromRevision} restored as revision ${saved.revision.number}.`
          : action === "publish"
            ? `Published revision ${saved.revision.number}. Public caches were refreshed.`
            : action === "unpublish"
              ? `Unpublished as revision ${saved.revision.number}. Public caches were refreshed.`
              : action === "restore"
                ? `Article restored as draft revision ${saved.revision.number}.`
                : saved.state === "published"
                  ? `Published update saved as revision ${saved.revision.number}.`
                  : `Draft saved as revision ${saved.revision.number}.`,
      );
      setPendingMutation(null);
      setRestoreFromRevision(null);
      setSelectedRevision(null);
      setRevisions((current) => [
        saved,
        ...current.filter(
          (item) => item.revision.number !== saved.revision.number,
        ),
      ]);
      return saved;
    } catch (error) {
      if (onSessionFailure(error)) {
        return null;
      }
      if (
        error instanceof EditorialApiError &&
        error.code === "REVISION_CONFLICT"
      ) {
        setConflict(error.message);
      } else {
        setMessage(`${failureLabel} failed: ${friendlyError(error)}`);
      }
      if (!(error instanceof EditorialApiError) || !error.retryable) {
        setPendingMutation(null);
      }
      return null;
    }
  }

  async function saveDraft(event: React.FormEvent) {
    event.preventDefault();
    if (readOnly || actionLockRef.current) return;
    actionLockRef.current = true;
    setActiveAction("save");
    try {
      await persistArticle("save", draft, persisted, "Saving draft…", "Save");
    } finally {
      actionLockRef.current = false;
      setActiveAction(null);
    }
  }

  async function previewArticle() {
    if (readOnly || actionLockRef.current) return;
    actionLockRef.current = true;
    const previewTab = reservePreviewTab();
    setActiveAction("preview");
    try {
      let previewSource = persisted;
      if (!previewSource || dirty) {
        const publishingUpdate = draft.state === "published";
        previewSource = await persistArticle(
          "save",
          draft,
          persisted,
          publishingUpdate
            ? "Publishing the current update before opening preview…"
            : "Saving the current draft before opening preview…",
          "Preview",
        );
      }
      if (!previewSource) {
        previewTab?.close();
        return;
      }
      setMessage("Opening preview…");
      navigatePreviewTab(
        previewTab,
        `/api/admin/preview?slug=${encodeURIComponent(previewSource.slug)}`,
      );
      setMessage(
        `Preview opened for revision ${previewSource.revision.number}.`,
      );
    } finally {
      actionLockRef.current = false;
      setActiveAction(null);
    }
  }

  async function publishArticle() {
    if (readOnly || actionLockRef.current || draft.state !== "draft") return;
    actionLockRef.current = true;
    setActiveAction("publish");
    try {
      let basePersisted = persisted;
      let sourceDraft = draft;
      if (!basePersisted) {
        const savedDraft = await persistArticle(
          "save",
          draft,
          null,
          "Saving the new draft before publishing…",
          "Publish",
        );
        if (!savedDraft) return;
        basePersisted = savedDraft;
        sourceDraft = savedDraft;
      }
      await persistArticle(
        "publish",
        sourceDraft,
        basePersisted,
        "Publishing…",
        "Publish",
      );
    } finally {
      actionLockRef.current = false;
      setActiveAction(null);
    }
  }

  async function runMutation(action: "restore" | "unpublish") {
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    setActiveAction(action);
    try {
      await persistArticle(
        action,
        draft,
        persisted,
        action === "restore" ? "Restoring draft…" : "Unpublishing…",
        action === "restore" ? "Restore" : "Unpublish",
      );
    } finally {
      actionLockRef.current = false;
      setActiveAction(null);
    }
  }

  async function reloadLatest() {
    if (!persisted) return;
    try {
      const latest = await getEditorialArticle(persisted.id);
      onSaved(latest);
      setConflict(null);
      setMessage(
        "Latest revision loaded. Your conflicting local changes were replaced.",
      );
      void loadRevisions();
    } catch (error) {
      if (!onSessionFailure(error)) setMessage(friendlyError(error));
    }
  }

  function loadSelectedRevision() {
    const selected = revisions.find(
      (item) => item.revision.number === selectedRevision,
    );
    if (!selected) return;
    onChange({
      ...draft,
      slug: selected.slug,
      title: selected.title,
      excerpt: selected.excerpt,
      author: selected.author,
      category: selected.category,
      body: selected.body,
      featuredImage: selected.featuredImage,
      ogImage: selected.ogImage,
      ...(draft.state === "archived"
        ? { publishedAt: null, state: "draft" as const }
        : {}),
    });
    setPendingMutation(null);
    setRestoreFromRevision(selected.revision.number);
    setMessage(
      `Revision ${selected.revision.number} was loaded into the unsaved draft. Save draft to create a new revision.`,
    );
  }

  return (
    <section aria-labelledby="article-editor-heading">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          <ArrowLeft aria-hidden="true" className="mr-2" size={16} /> Back to
          articles
        </Button>
        <p className="text-body-xs text-text-secondary" aria-live="polite">
          {dirty
            ? "Unsaved changes"
            : persisted
              ? `Revision ${persisted.revision.number} saved`
              : "New unsaved article"}
        </p>
      </div>
      {confirmDiscard && (
        <div
          role="alertdialog"
          aria-labelledby="discard-heading"
          className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
        >
          <h2 id="discard-heading" className="font-bold">
            Discard unsaved changes?
          </h2>
          <p className="text-body-sm mt-1">
            Choose “Back to articles” again to discard them, or keep editing.
          </p>
        </div>
      )}
      {readOnly && (
        <div
          role="note"
          className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
        >
          This archived article is read-only. Restore it to a draft before
          editing.
        </div>
      )}
      {conflict && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4"
        >
          <h2 className="font-bold">A newer revision exists</h2>
          <p className="text-body-sm mt-1">
            {conflict} Your unsaved version has not overwritten it.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={reloadLatest}
            className="mt-4"
          >
            Load latest revision
          </Button>
        </div>
      )}
      {message && (
        <div
          role={Object.keys(errors).length ? "alert" : "status"}
          className="border-border bg-bg-secondary text-body-sm mb-6 rounded-lg border p-4"
        >
          {message}
        </div>
      )}

      <div className="space-y-8">
        <form onSubmit={saveDraft} noValidate className="space-y-8">
          <Card hover={false}>
            <p className="text-body-xs text-accent font-mono tracking-[0.16em] uppercase">
              {persisted ? "Edit draft" : "New draft"}
            </p>
            <h2
              id="article-editor-heading"
              className="font-display mt-2 text-2xl font-bold"
            >
              Article details
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field
                label="Title"
                path="title"
                error={errors.title}
                className="md:col-span-2"
              >
                <input
                  ref={titleRef}
                  id="title"
                  value={draft.title}
                  disabled={readOnly}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  onChange={(event) => field("title", event.target.value)}
                  onBlur={() => {
                    if (!draft.slug) field("slug", slugFromTitle(draft.title));
                  }}
                  className={inputClass}
                />
              </Field>
              <Field
                label="URL slug"
                path="slug"
                error={errors.slug}
                hint="Lowercase words separated by hyphens."
              >
                <div className="border-border bg-bg-primary focus-within:border-accent focus-within:ring-accent/25 mt-2 flex items-center rounded-lg border focus-within:ring-2">
                  <span className="text-text-muted pl-3">/blog/</span>
                  <input
                    id="slug"
                    value={draft.slug}
                    disabled={readOnly}
                    aria-invalid={Boolean(errors.slug)}
                    aria-describedby={errors.slug ? "slug-error" : "slug-hint"}
                    onChange={(event) =>
                      field("slug", slugFromTitle(event.target.value))
                    }
                    className="min-w-0 flex-1 bg-transparent px-1 py-2.5 outline-none"
                  />
                </div>
              </Field>
              <Field label="Category" path="category" error={errors.category}>
                <input
                  id="category"
                  value={draft.category}
                  disabled={readOnly}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? "category-error" : undefined
                  }
                  onChange={(event) => field("category", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Author"
                path="author.name"
                error={errors["author.name"]}
                hint={
                  getAuthorByReference(draft.author)
                    ? "Controls the byline, Written by card, and article metadata."
                    : draft.author.name
                      ? `“${draft.author.name}” has no registered author profile. Select an author to add the Written by card.`
                      : "Controls the byline, Written by card, and article metadata."
                }
              >
                <select
                  id="author.name"
                  value={
                    getAuthorByReference(draft.author) ? draft.author.id : ""
                  }
                  disabled={readOnly}
                  aria-invalid={Boolean(errors["author.name"])}
                  aria-describedby={
                    errors["author.name"]
                      ? "author.name-error"
                      : "author.name-hint"
                  }
                  onChange={(event) => selectAuthor(event.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    {!getAuthorByReference(draft.author) && draft.author.name
                      ? `Select an author — “${draft.author.name}” has no profile`
                      : "Select an author"}
                  </option>
                  {TEAM_AUTHORS.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Excerpt"
                path="excerpt"
                error={errors.excerpt}
                className="md:col-span-2"
                hint={`${draft.excerpt.length}/400 characters`}
              >
                <textarea
                  id="excerpt"
                  rows={3}
                  maxLength={400}
                  value={draft.excerpt}
                  disabled={readOnly}
                  aria-invalid={Boolean(errors.excerpt)}
                  aria-describedby={
                    errors.excerpt ? "excerpt-error" : "excerpt-hint"
                  }
                  onChange={(event) => field("excerpt", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>

          <Card hover={false}>
            <h2 className="font-display text-xl font-bold">Article body</h2>
            <p id="body-hint" className="text-body-sm text-text-secondary mt-2">
              Write the article body in Markdown.
            </p>
            <MarkdownEditor
              id="body.source"
              value={draft.body.source}
              disabled={readOnly}
              invalid={
                Boolean(errors["body.source"]) || markdownIssues.length > 0
              }
              describedBy={
                errors["body.source"]
                  ? "body-hint body.source-error"
                  : "body-hint body-live-status"
              }
              onChange={(value) => field("body.source", value)}
            />
            {errors["body.source"] && (
              <p
                id="body.source-error"
                className="text-body-sm mt-2 text-red-600 dark:text-red-400"
              >
                {errors["body.source"]}
              </p>
            )}
            {!errors["body.source"] && (
              <div
                id="body-live-status"
                aria-live="polite"
                className={`text-body-sm mt-3 ${
                  markdownIssues.length
                    ? "text-red-600 dark:text-red-400"
                    : "text-text-secondary"
                }`}
              >
                {markdownIssues.length ? (
                  <>
                    <p className="font-medium">
                      {markdownIssues.length} Markdown{" "}
                      {markdownIssues.length === 1 ? "issue" : "issues"} found
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {markdownIssues.map((issue, index) => (
                        <li
                          key={`${issue.line ?? 0}-${issue.message}-${index}`}
                        >
                          {issue.line ? `Line ${issue.line}: ` : ""}
                          {issue.message}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No Markdown policy issues found.</p>
                )}
              </div>
            )}
          </Card>

          <AssetEditor
            article={draft}
            assets={assets}
            errors={errors}
            readOnly={readOnly}
            onAssetChange={setAsset}
            onAltChange={setAssetAlt}
            onUploaded={(slot, asset) => {
              onAsset(asset);
              const next = structuredClone(draft);
              next[slot] = articleAssetReference(asset);
              applyChange(next);
            }}
            onSessionFailure={onSessionFailure}
          />

          <div className="border-border bg-bg-elevated/95 sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-xl border p-4 shadow-xl backdrop-blur">
            <Button
              type="submit"
              size="sm"
              disabled={readOnly || activeAction !== null}
              className="shrink-0 whitespace-nowrap"
            >
              <Save aria-hidden="true" className="mr-2" size={18} />{" "}
              {activeAction === "save"
                ? "Saving…"
                : restoreFromRevision !== null
                  ? "Restore revision"
                  : draft.state === "published"
                    ? "Publish update"
                    : "Save draft"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={draft.state === "archived" || activeAction !== null}
              aria-describedby="preview-note"
              className="shrink-0 whitespace-nowrap"
              onClick={() => void previewArticle()}
            >
              <Eye aria-hidden="true" className="mr-2" size={18} />{" "}
              {activeAction === "preview" ? "Preparing preview…" : "Preview"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={draft.state !== "draft" || activeAction !== null}
              className="shrink-0 whitespace-nowrap"
              onClick={() => void publishArticle()}
            >
              {activeAction === "publish"
                ? persisted
                  ? "Publishing…"
                  : "Saving and publishing…"
                : "Publish"}
            </Button>
            {persisted?.state === "published" && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={dirty || activeAction !== null}
                className="shrink-0 whitespace-nowrap"
                onClick={() => void runMutation("unpublish")}
              >
                Unpublish
              </Button>
            )}
            {persisted?.state === "archived" && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={activeAction !== null}
                className="shrink-0 whitespace-nowrap"
                onClick={() => void runMutation("restore")}
              >
                Restore to draft
              </Button>
            )}
            <p
              id="preview-note"
              className="text-body-xs text-text-secondary min-w-0 flex-1 sm:text-right"
            >
              {!persisted
                ? "Preview saves this draft automatically. Publish saves and publishes it in one action."
                : dirty && persisted.state === "published"
                  ? "Preview publishes the current update before opening it."
                  : dirty
                    ? "Preview and Publish save the current changes automatically."
                    : persisted.state === "published"
                      ? "Preview opens the current published revision."
                      : persisted.state === "archived"
                        ? "Restore this article before editing or previewing it."
                        : "Preview opens the saved draft without publishing."}
            </p>
          </div>
        </form>

        <RevisionHistory
          revisions={revisions}
          state={revisionState}
          selected={selectedRevision}
          current={persisted?.revision.number ?? null}
          onSelect={setSelectedRevision}
          onRetry={loadRevisions}
          onLoad={loadSelectedRevision}
        />
      </div>
    </section>
  );
}

function Field({
  label,
  path,
  error,
  hint,
  className = "",
  children,
}: {
  label: string;
  path: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={path} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${path}-error`}
          className="text-body-sm mt-2 text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${path}-hint`}
          className="text-body-xs text-text-secondary mt-2"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function AssetEditor({
  article,
  assets,
  errors,
  readOnly,
  onAssetChange,
  onAltChange,
  onUploaded,
  onSessionFailure,
}: {
  article: Article;
  assets: EditorialAsset[];
  errors: ArticleFieldErrors;
  readOnly: boolean;
  onAssetChange: (slot: AssetSlot, id: string) => void;
  onAltChange: (slot: AssetSlot, alt: string) => void;
  onUploaded: (slot: AssetSlot, asset: EditorialAsset) => void;
  onSessionFailure: (error: unknown) => boolean;
}) {
  const [pickerSlot, setPickerSlot] = useState<AssetSlot | null>(null);
  const [pickerView, setPickerView] = useState<"library" | "upload">("library");
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const sortedAssets = useMemo(
    () =>
      [...assets].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
      ),
    [assets],
  );

  useEffect(() => {
    if (!pickerSlot) return;
    closeButtonRef.current?.focus();
    const handleDialogKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPickerSlot(null);
        window.requestAnimationFrame(() => openerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeyboard);
    return () => document.removeEventListener("keydown", handleDialogKeyboard);
  }, [pickerSlot]);

  function slotLabel(imageSlot: AssetSlot): string {
    return imageSlot === "featuredImage" ? "Featured image" : "Social image";
  }

  function openPicker(imageSlot: AssetSlot, trigger: HTMLButtonElement): void {
    openerRef.current = trigger;
    setPickerSlot(imageSlot);
    setPickerView("library");
    setFile(null);
    setAlt("");
    setState("idle");
    setError(null);
    setNotice(null);
  }

  function closePicker(): void {
    setPickerSlot(null);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }

  function chooseAsset(asset: EditorialAsset): void {
    if (!pickerSlot) return;
    const label = slotLabel(pickerSlot).toLowerCase();
    onAssetChange(pickerSlot, asset.id);
    setNotice(`${asset.originalFileName} selected as the ${label}.`);
    closePicker();
  }

  function removeAsset(imageSlot: AssetSlot): void {
    onAssetChange(imageSlot, "");
    setNotice(`${slotLabel(imageSlot)} removed.`);
  }

  async function upload() {
    const normalizedAlt = alt.trim();
    if (
      !pickerSlot ||
      !file ||
      (normalizedAlt.length > 0 && normalizedAlt.length < 5)
    ) {
      setError(
        "Choose an image and provide at least five characters of descriptive alt text, or leave alt text blank when the image is decorative.",
      );
      return;
    }
    setState("loading");
    setError(null);
    try {
      const asset = await uploadEditorialAsset({
        altText: normalizedAlt,
        articleId: article.id,
        file,
      });
      const label = slotLabel(pickerSlot).toLowerCase();
      onUploaded(pickerSlot, asset);
      setFile(null);
      setAlt("");
      setState("ready");
      setNotice(
        `${asset.originalFileName} uploaded and selected as the ${label}.`,
      );
      closePicker();
    } catch (caught) {
      if (!onSessionFailure(caught)) setError(friendlyError(caught));
      setState("error");
    }
  }

  return (
    <Card hover={false}>
      <h2 className="font-display text-xl font-bold">Images</h2>
      <p className="text-body-sm text-text-secondary mt-2">
        JPEG, PNG, WebP, or AVIF. Maximum 5 MiB and 6000 pixels per side. Alt
        text should describe informative images; leave it blank for decorative
        images.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {(["featuredImage", "ogImage"] as const).map((imageSlot) => {
          const value = article[imageSlot];
          const label = slotLabel(imageSlot);
          const asset = assets.find((item) => item.id === value?.assetId);
          return (
            <fieldset
              key={imageSlot}
              className="border-border rounded-xl border p-4"
            >
              <legend className="font-display px-1 font-bold">{label}</legend>
              <div className="bg-bg-secondary border-border mt-2 overflow-hidden rounded-lg border">
                {value ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={value.deliveryUrl}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                    />
                    <div className="p-3">
                      <p className="text-body-sm truncate font-medium">
                        {asset?.originalFileName ?? "Selected image"}
                      </p>
                      {asset && (
                        <p className="text-body-xs text-text-secondary mt-1">
                          {asset.width} × {asset.height} px
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 p-6 text-center">
                    <Images
                      aria-hidden="true"
                      className="text-text-muted"
                      size={30}
                    />
                    <p className="text-body-sm text-text-secondary">
                      No image selected
                    </p>
                  </div>
                )}
              </div>
              {!readOnly && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={(event) =>
                      openPicker(imageSlot, event.currentTarget)
                    }
                  >
                    <ImagePlus aria-hidden="true" className="mr-2" size={16} />
                    {value ? "Replace image" : "Choose image"}
                  </Button>
                  {value && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeAsset(imageSlot)}
                    >
                      <Trash2 aria-hidden="true" className="mr-2" size={16} />
                      Remove image
                    </Button>
                  )}
                </div>
              )}
              {value && (
                <div className="mt-4">
                  <label
                    className="text-body-sm block"
                    htmlFor={`${imageSlot}-alt`}
                  >
                    Contextual alt text
                  </label>
                  <input
                    id={`${imageSlot}-alt`}
                    value={value.altText}
                    maxLength={300}
                    disabled={readOnly}
                    aria-invalid={Boolean(errors[`${imageSlot}.altText`])}
                    aria-describedby={
                      errors[`${imageSlot}.altText`]
                        ? `${imageSlot}-alt-error`
                        : undefined
                    }
                    onChange={(event) =>
                      onAltChange(imageSlot, event.target.value)
                    }
                    className={inputClass}
                  />
                  {errors[`${imageSlot}.altText`] && (
                    <p
                      id={`${imageSlot}-alt-error`}
                      className="text-body-sm mt-2 text-red-600 dark:text-red-400"
                    >
                      {errors[`${imageSlot}.altText`]}
                    </p>
                  )}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>
      {notice && (
        <p role="status" className="text-body-sm text-accent mt-4">
          {notice}
        </p>
      )}
      {pickerSlot && !readOnly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-picker-title"
            className="border-border bg-bg-elevated max-h-[min(48rem,calc(100vh-2rem))] w-full max-w-4xl overflow-y-auto rounded-xl border shadow-2xl"
          >
            <div className="border-border flex items-center justify-between gap-4 border-b p-4 sm:p-6">
              <div>
                <p className="text-body-xs text-accent font-mono tracking-[0.18em] uppercase">
                  Media library
                </p>
                <h3
                  id="media-picker-title"
                  className="font-display mt-1 text-xl font-bold"
                >
                  Choose {slotLabel(pickerSlot).toLowerCase()}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closePicker}
                aria-label="Close media library"
                className="border-border hover:border-accent focus-visible:outline-focus rounded-lg border p-2 transition focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            <div className="border-border flex flex-wrap gap-2 border-b px-4 py-3 sm:px-6">
              <Button
                type="button"
                size="sm"
                variant={pickerView === "library" ? "primary" : "secondary"}
                aria-pressed={pickerView === "library"}
                onClick={() => {
                  setPickerView("library");
                  setError(null);
                }}
              >
                <Images aria-hidden="true" className="mr-2" size={16} />
                Media library
              </Button>
              <Button
                type="button"
                size="sm"
                variant={pickerView === "upload" ? "primary" : "secondary"}
                aria-pressed={pickerView === "upload"}
                onClick={() => {
                  setPickerView("upload");
                  setError(null);
                }}
              >
                <Upload aria-hidden="true" className="mr-2" size={16} />
                Upload new
              </Button>
            </div>

            <div className="p-4 sm:p-6">
              {pickerView === "library" ? (
                sortedAssets.length ? (
                  <ul
                    aria-label="Previously uploaded images"
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {sortedAssets.map((asset) => {
                      const selected =
                        article[pickerSlot]?.assetId === asset.id;
                      return (
                        <li key={asset.id}>
                          <button
                            type="button"
                            onClick={() => chooseAsset(asset)}
                            aria-label={`Choose ${asset.originalFileName}`}
                            aria-pressed={selected}
                            className={`focus-visible:outline-focus h-full w-full overflow-hidden rounded-lg border text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                              selected
                                ? "border-accent ring-accent/30 ring-2"
                                : "border-border hover:border-accent"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={asset.deliveryUrl}
                              alt=""
                              className="aspect-[16/9] w-full object-cover"
                            />
                            <span className="block p-3">
                              <span className="flex items-start justify-between gap-2">
                                <span className="text-body-sm min-w-0 truncate font-medium">
                                  {asset.originalFileName}
                                </span>
                                {selected && (
                                  <Check
                                    aria-hidden="true"
                                    className="text-accent shrink-0"
                                    size={18}
                                  />
                                )}
                              </span>
                              <span className="text-body-xs text-text-secondary mt-1 block">
                                {asset.width} × {asset.height} px
                              </span>
                              <span className="text-body-xs text-text-secondary mt-2 line-clamp-2 block">
                                {asset.altText}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="border-border rounded-lg border border-dashed p-8 text-center">
                    <Images
                      aria-hidden="true"
                      className="text-text-muted mx-auto"
                      size={36}
                    />
                    <p className="font-display mt-3 font-bold">
                      No uploaded images yet
                    </p>
                    <p className="text-body-sm text-text-secondary mt-1">
                      Upload the first image to add it to the shared library.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      className="mt-4"
                      onClick={() => setPickerView("upload")}
                    >
                      <Upload aria-hidden="true" className="mr-2" size={16} />
                      Upload new
                    </Button>
                  </div>
                )
              ) : (
                <div className="max-w-2xl">
                  <h4 className="font-display font-bold">Upload new image</h4>
                  <p className="text-body-sm text-text-secondary mt-1">
                    The image will be available in the media library for future
                    articles.
                  </p>
                  <div className="mt-5 grid gap-4">
                    <label className="text-body-sm">
                      Image file
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={(event) =>
                          setFile(event.target.files?.[0] ?? null)
                        }
                        className={`${inputClass} file:bg-accent file:mr-3 file:rounded file:border-0 file:px-3 file:py-1 file:text-white`}
                      />
                    </label>
                    <label className="text-body-sm">
                      Alt text (leave blank if decorative)
                      <input
                        value={alt}
                        maxLength={300}
                        onChange={(event) => setAlt(event.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </div>
                  {error && (
                    <p
                      role="alert"
                      className="text-body-sm mt-3 text-red-600 dark:text-red-400"
                    >
                      {error}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={upload}
                      size="sm"
                      disabled={state === "loading"}
                    >
                      <Upload aria-hidden="true" className="mr-2" size={16} />
                      {state === "loading" ? "Uploading…" : "Upload and use"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setPickerView("library");
                        setError(null);
                      }}
                    >
                      Back to library
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function RevisionHistory({
  revisions,
  state,
  selected,
  current,
  onSelect,
  onRetry,
  onLoad,
}: {
  revisions: Article[];
  state: LoadState;
  selected: number | null;
  current: number | null;
  onSelect: (revision: number) => void;
  onRetry: () => void;
  onLoad: () => void;
}) {
  const selectedArticle = revisions.find(
    (item) => item.revision.number === selected,
  );
  return (
    <aside aria-labelledby="revision-history-heading">
      <Card hover={false}>
        <h2
          id="revision-history-heading"
          className="font-display flex items-center text-xl font-bold"
        >
          <Clock3 aria-hidden="true" className="mr-2" size={20} />
          Revision history
        </h2>
        {!current ? (
          <p className="text-body-sm text-text-secondary mt-3">
            History appears after the first save.
          </p>
        ) : state === "loading" ? (
          <div role="status" className="text-body-sm text-text-secondary mt-4">
            Loading revisions…
          </div>
        ) : state === "error" ? (
          <div role="alert" className="mt-4">
            <p className="text-body-sm">Revision history is unavailable.</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        ) : (
          <fieldset className="mt-4">
            <legend className="sr-only">Select an article revision</legend>
            <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
              {revisions.map((revision) => (
                <label
                  key={revision.revision.number}
                  className="border-border has-[:checked]:border-accent has-[:checked]:bg-green-bright-10 flex cursor-pointer gap-3 rounded-lg border p-3"
                >
                  <input
                    type="radio"
                    name="revision"
                    value={revision.revision.number}
                    checked={selected === revision.revision.number}
                    onChange={() => onSelect(revision.revision.number)}
                  />
                  <span className="text-body-sm">
                    <span className="block font-medium">
                      Revision {revision.revision.number}
                      {revision.revision.number === current ? " (current)" : ""}
                    </span>
                    <span className="text-body-xs text-text-secondary">
                      {new Date(revision.modifiedAt).toLocaleString()} ·{" "}
                      {stateLabel(revision.state)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {selectedArticle && selectedArticle.revision.number !== current && (
          <div className="border-border mt-5 border-t pt-5">
            <h3 className="font-medium">Selected snapshot</h3>
            <p className="text-body-sm text-text-secondary mt-2">
              {selectedArticle.title}
            </p>
            <pre className="bg-bg-secondary text-body-xs mt-3 max-h-40 overflow-auto rounded p-3 font-mono whitespace-pre-wrap">
              {selectedArticle.body.source}
            </pre>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onLoad}
              className="mt-4"
            >
              Load into draft
            </Button>
          </div>
        )}
      </Card>
    </aside>
  );
}
