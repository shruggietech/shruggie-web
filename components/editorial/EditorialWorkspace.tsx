"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Clock3,
  FilePlus2,
  ImagePlus,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Save,
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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import SignInPanel from "./SignInPanel";

type LoadState = "idle" | "loading" | "ready" | "error";
type AssetSlot = "featuredImage" | "ogImage";

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
    setDraft(createBlankArticle(editor.id));
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
  const [saveState, setSaveState] = useState<LoadState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<Article[]>([]);
  const [revisionState, setRevisionState] = useState<LoadState>(
    persisted ? "loading" : "ready",
  );
  const [selectedRevision, setSelectedRevision] = useState<number | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const readOnly = draft.state !== "draft";

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const textarea = bodyRef.current;
    if (!textarea) return;

    const containWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      const multiplier =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? textarea.clientHeight
            : 1;
      const maximum = Math.max(
        0,
        textarea.scrollHeight - textarea.clientHeight,
      );
      textarea.scrollTop = Math.min(
        maximum,
        Math.max(0, textarea.scrollTop + event.deltaY * multiplier),
      );
      event.preventDefault();
      event.stopPropagation();
    };

    textarea.addEventListener("wheel", containWheel, { passive: false });
    return () => textarea.removeEventListener("wheel", containWheel);
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

  const articleAssets = useMemo(
    () => assets.filter((asset) => asset.articleId === draft.id),
    [assets, draft.id],
  );

  function field(path: string, value: string) {
    const next = structuredClone(draft);
    if (path === "title") next.title = value;
    if (path === "slug") next.slug = value;
    if (path === "excerpt") next.excerpt = value;
    if (path === "author.name") next.author.name = value;
    if (path === "category") next.category = value;
    if (path === "body.source") next.body.source = value;
    onChange(next);
    setErrors((current) => {
      const updated = { ...current };
      delete updated[path];
      return updated;
    });
    setMessage(null);
  }

  function setAsset(slot: AssetSlot, assetId: string) {
    const next = structuredClone(draft);
    const asset = articleAssets.find((item) => item.id === assetId);
    next[slot] = asset ? articleAssetReference(asset) : null;
    onChange(next);
  }

  function setAssetAlt(slot: AssetSlot, altText: string) {
    const next = structuredClone(draft);
    if (next[slot]) next[slot] = { ...next[slot], altText };
    onChange(next);
  }

  async function saveDraft(event: React.FormEvent) {
    event.preventDefault();
    if (readOnly) return;
    const candidate = articleForSave(draft, editor.id, persisted);
    const nextErrors = validateArticleForSave(candidate);
    setErrors(nextErrors);
    setMessage(null);
    setConflict(null);
    if (Object.keys(nextErrors).length) {
      setMessage(
        "Review the highlighted fields. Your unsaved work has been preserved.",
      );
      const firstField = Object.keys(nextErrors).find(
        (path) => path !== "form",
      );
      if (firstField) document.getElementById(firstField)?.focus();
      return;
    }
    setSaveState("loading");
    try {
      const saved = persisted
        ? await updateEditorialArticle(candidate, persisted.revision.number)
        : await createEditorialArticle(candidate);
      onSaved(saved);
      setMessage(`Draft saved as revision ${saved.revision.number}.`);
      setSaveState("ready");
      setSelectedRevision(null);
      setRevisions((current) => [
        saved,
        ...current.filter(
          (item) => item.revision.number !== saved.revision.number,
        ),
      ]);
    } catch (error) {
      if (onSessionFailure(error)) return;
      if (
        error instanceof EditorialApiError &&
        error.code === "REVISION_CONFLICT"
      ) {
        setConflict(error.message);
      } else {
        setMessage(friendlyError(error));
      }
      setSaveState("error");
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
    });
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
          This {draft.state} article is read-only in the draft workspace.
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

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
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
                label="Author name"
                path="author.name"
                error={errors["author.name"]}
              >
                <input
                  id="author.name"
                  value={draft.author.name}
                  disabled={readOnly}
                  aria-invalid={Boolean(errors["author.name"])}
                  aria-describedby={
                    errors["author.name"] ? "author.name-error" : undefined
                  }
                  onChange={(event) => field("author.name", event.target.value)}
                  className={inputClass}
                />
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
              Markdown is supported. Raw HTML, JSX, scripts, and unsafe links
              are rejected.
            </p>
            <textarea
              ref={bodyRef}
              id="body.source"
              aria-label="Article body in Markdown"
              data-lenis-prevent
              rows={22}
              value={draft.body.source}
              disabled={readOnly}
              aria-invalid={Boolean(errors["body.source"])}
              aria-describedby={
                errors["body.source"] ? "body.source-error" : "body-hint"
              }
              onChange={(event) => field("body.source", event.target.value)}
              className={`${inputClass} text-body-sm resize-y overscroll-contain font-mono leading-6`}
            />
            {errors["body.source"] && (
              <p
                id="body.source-error"
                className="text-body-sm mt-2 text-red-600 dark:text-red-400"
              >
                {errors["body.source"]}
              </p>
            )}
          </Card>

          <AssetEditor
            article={draft}
            assets={articleAssets}
            errors={errors}
            readOnly={readOnly}
            onAssetChange={setAsset}
            onAltChange={setAssetAlt}
            onUploaded={(slot, asset) => {
              onAsset(asset);
              const next = structuredClone(draft);
              next[slot] = articleAssetReference(asset);
              onChange(next);
            }}
            onSessionFailure={onSessionFailure}
          />

          <div className="border-border bg-bg-elevated/95 sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={readOnly || saveState === "loading"}
            >
              <Save aria-hidden="true" className="mr-2" size={18} />{" "}
              {saveState === "loading" ? "Saving…" : "Save draft"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled
              aria-describedby="publish-note"
            >
              Publish
            </Button>
            <p id="publish-note" className="text-body-xs text-text-secondary">
              Publishing requires review.
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
  const [slot, setSlot] = useState<AssetSlot>("featuredImage");
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    if (!file || alt.trim().length < 5) {
      setError(
        "Choose an image and provide at least five characters of descriptive alt text.",
      );
      return;
    }
    setState("loading");
    setError(null);
    try {
      const asset = await uploadEditorialAsset({
        altText: alt,
        articleId: article.id,
        file,
      });
      onUploaded(slot, asset);
      setFile(null);
      setAlt("");
      setState("ready");
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
        text is required.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {(["featuredImage", "ogImage"] as const).map((imageSlot) => {
          const value = article[imageSlot];
          const label =
            imageSlot === "featuredImage" ? "Featured image" : "Social image";
          return (
            <fieldset
              key={imageSlot}
              className="border-border rounded-lg border p-4"
            >
              <legend className="px-1 font-medium">{label}</legend>
              <label htmlFor={`${imageSlot}-asset`} className="text-body-sm">
                Select {label.toLowerCase()}
              </label>
              <select
                id={`${imageSlot}-asset`}
                value={value?.assetId ?? ""}
                disabled={readOnly}
                onChange={(event) =>
                  onAssetChange(imageSlot, event.target.value)
                }
                className={inputClass}
              >
                <option value="">No image</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.originalFileName}
                  </option>
                ))}
              </select>
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
                    minLength={5}
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
      {!readOnly && (
        <div className="bg-bg-secondary mt-6 rounded-lg p-4">
          <h3 className="font-display font-bold">
            <ImagePlus aria-hidden="true" className="mr-2 inline" size={18} />
            Upload an image
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-body-sm">
              Use as
              <select
                value={slot}
                onChange={(event) => setSlot(event.target.value as AssetSlot)}
                className={inputClass}
              >
                <option value="featuredImage">Featured image</option>
                <option value="ogImage">Social image</option>
              </select>
            </label>
            <label className="text-body-sm">
              Image file
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className={`${inputClass} file:bg-accent file:mr-3 file:rounded file:border-0 file:px-3 file:py-1 file:text-white`}
              />
            </label>
            <label className="text-body-sm md:col-span-2">
              Descriptive alt text
              <input
                value={alt}
                minLength={5}
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
          {state === "ready" && (
            <p role="status" className="text-body-sm text-accent mt-3">
              Image uploaded and selected.
            </p>
          )}
          <Button
            type="button"
            onClick={upload}
            variant="secondary"
            size="sm"
            disabled={state === "loading"}
            className="mt-4"
          >
            {state === "loading" ? "Uploading…" : "Upload image"}
          </Button>
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
    <aside
      aria-labelledby="revision-history-heading"
      className="xl:sticky xl:top-24 xl:self-start"
    >
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
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
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
