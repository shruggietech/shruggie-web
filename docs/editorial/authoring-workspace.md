# Staff article-authoring workspace

Issue [#27](https://github.com/shruggietech/shruggie-web/issues/27) adds the
private workspace at `/admin`. It uses the project-owned article and asset
contracts from #25 and the server session boundary from #26.

## Staff workflow

1. Open `/admin` and sign in with an approved `shruggie.tech` Google account.
   Authentication uses a same-tab Firebase redirect so browsers that suppress
   popup windows cannot leave the workspace waiting indefinitely.
2. Create a draft or open an existing draft from the article list.
3. Complete the article details and Markdown body. Leaving the title field
   proposes a canonical slug when the slug is still empty.
4. Upload or select featured and social images. Every upload requires
   contextual alternative text and is revalidated by the server.
5. Choose **Save draft**. Validation moves focus to the first invalid field and
   does not clear any unsaved values.
6. Use revision history to inspect an earlier snapshot or load it into the
   unsaved form. Saving that form creates a new monotonic revision; it never
   overwrites the selected historical record.

Draft saving and public publishing are deliberately separate. The workspace
does not expose a working publish button until the reviewed publication,
preview, rollback, and cache-convergence workflow in #28 is complete.

## Failure behavior

- A stale save returns a visible conflict and keeps the local form intact.
- Unsaved forms are recoverable from same-tab session storage across the Google
  redirect. The recovery record is cleared after saving, discarding, or
  signing out.
- Article-list and revision-history failures provide bounded retry actions.
- Dependency failures are described without claiming that a write succeeded.
- Published and archived records are read-only until #28 supplies the complete
  lifecycle workflow.

## Accessibility

The workspace uses native headings, labels, fieldsets, buttons, alerts, status
regions, and radio controls. Validation associates each error with its field
and moves focus to the first failure. The complete draft journey is covered by
keyboard interaction tests and an automated axe scan; reduced-motion styling
removes nonessential loading and transition motion.
