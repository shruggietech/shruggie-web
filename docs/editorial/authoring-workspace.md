# Staff article-authoring workspace

Issue [#27](https://github.com/shruggietech/shruggie-web/issues/27) adds the
private workspace at `/admin`. It uses the project-owned article and asset
contracts from #25 and the server session boundary from #26.

## Staff workflow

1. Open `/admin` and sign in with an approved `shruggie.tech` Google account.
   Authentication uses a same-tab Firebase redirect so browsers that suppress
   popup windows cannot leave the workspace waiting indefinitely. Production
   serves Firebase's auth helper through `/__/auth/*` on `shruggie.tech`, which
   keeps redirect state first-party in storage-partitioned browsers.
2. Create a draft or open an existing draft from the article list.
3. Complete the article details and Markdown body. Leaving the title field
   proposes a canonical slug when the slug is still empty.
4. Upload or select featured and social images. Every upload requires
   contextual alternative text and is revalidated by the server.
5. Choose **Save draft** whenever you want a private revision checkpoint. This
   remains optional before Preview or Publish. Validation moves focus to the
   first invalid field and does not clear any unsaved values.
6. Choose **Preview** to save a new or changed draft automatically and open that
   exact revision through the public article template. If a browser blocks the
   reserved preview tab, the workspace falls back to same-tab navigation.
7. Choose **Publish** once from a new, changed, or clean draft. The workspace
   performs any required draft creation automatically, then the server commits
   the publication revision and audit event before invalidating the article,
   blog index, pagination, sitemap, metadata, and referenced media surfaces.
8. Open a published article to make corrections, then choose **Publish update**
   to save a new public revision without changing its original publication
   date. Because published articles do not have a separate private working
   copy, choosing **Preview** with pending published edits clearly publishes the
   update before opening it. Choose **Unpublish** only after saving or
   discarding local changes.
9. Use revision history to inspect an earlier immutable snapshot. Loading and
   saving that snapshot creates a new revision with an explicit `restore` audit
   event; it never overwrites history. Archived articles can be restored to a
   draft before editing.

Draft saving, preview, and public publishing remain distinct outcomes, but
Preview and Publish perform their save prerequisites automatically. The action
bar reports whether it is saving, opening a preview, publishing, restoring, or
unpublishing, and prevents duplicate activation while an action is in flight.
New published slugs are resolved from Firestore at request time and do not
require a repository commit or application deployment.

## Public delivery during migration

Until the migration in #29 is complete, `lib/blog.ts` merges published
Firestore articles with the repository-backed corpus. A Firestore record owns
its slug even while unpublished, preventing an older repository copy from
reappearing after unpublication. Published Firestore records override matching
repository slugs.

Published database reads use the Next.js data cache. Published edits can serve
the last successful representation while background revalidation runs;
publication-state and slug changes expire the exact article and shared index
data immediately. Index, pagination, and sitemap surfaces then converge through
their collection tag and path invalidation. If no cached or repository-backed
representation exists during an outage, the blog displays an explicit
temporary-unavailability state.

Uploaded media remains private until its owning article is published. The
same-origin `/media/[id]` route authorizes draft media with the editor session
and serves published media with bounded cache headers, an immutable checksum
ETag, and `nosniff` protection.

## Failure behavior

- A stale save returns a visible conflict and keeps the local form intact.
- Unsaved forms are recoverable from same-tab session storage across the Google
  redirect. The recovery record is cleared after saving, discarding, or
  signing out.
- Article-list and revision-history failures provide bounded retry actions.
- Dependency failures are described without claiming that a write succeeded.
- If the database commit succeeds but cache invalidation fails, the API returns
  a retryable failure. The browser retains the exact article payload and
  idempotency key so retrying completes convergence without creating a second
  revision.
- Published records remain editable through **Publish update**. Archived
  records remain read-only until explicitly restored to a draft.

## Accessibility

The workspace uses native headings, labels, fieldsets, buttons, alerts, status
regions, and radio controls. Validation associates each error with its field
and moves focus to the first failure. The complete draft journey is covered by
keyboard interaction tests and an automated axe scan; reduced-motion styling
removes nonessential loading and transition motion.
