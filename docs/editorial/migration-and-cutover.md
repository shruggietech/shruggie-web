# Blog migration and editorial cutover

Issue [#29](https://github.com/shruggietech/shruggie-web/issues/29)
moves the repository blog corpus into Firestore and makes the browser editorial
workspace the only production authoring path. This runbook separates reversible
data preparation from the production source switch.

## Authority contract

- `CMS_CONTENT_AUTHORITY=firestore` is the required Vercel production value.
  Deployed production also defaults to `firestore` when the variable is absent,
  so configuration drift cannot silently reactivate repository publication.
- `CMS_CONTENT_AUTHORITY=repository` is reserved for local development,
  migration comparison, and an explicitly invoked recovery deployment.
- `content/blog` and `public/images/blog` are immutable migration inputs after
  cutover. Changing them does not change the production blog.
- Firestore records are rendered through the existing project-owned adapter and
  shared article template. Firebase SDK objects never reach page components.

There is no hybrid mode after cutover. A Firestore outage may serve a previously
cached successful representation, but a cold read fails explicitly instead of
silently presenting an obsolete repository copy.

## Accounted corpus

[`blog-migration-manifest.json`](blog-migration-manifest.json) is the reviewed
inventory of every repository blog article and local image it references. It
records source SHA-256 checksums, lifecycle state, registered author, stable
target article and asset IDs, content type, and image alternative text.

At the 2026-09-12 inventory point, the repository contains two published
articles, no repository drafts, and two referenced local featured images. The
migration command refuses to run if a file is missing, a hash changes, an MDX
article is absent from the manifest, or a local article image is unaccounted
for. A content edit therefore requires deliberate manifest review rather than
silently entering the migration.

## Preflight

1. Confirm issue #28 is complete and the latest `main` deployment is healthy.
2. Freeze repository blog edits for the migration window.
3. Confirm the latest scheduled Firestore backup completed successfully.
4. Create a provider-neutral export outside the repository:

   ```powershell
   npm run cms:export -- --output=C:\secure-backups\shruggie-web-before-cutover
   ```

   The destination must not already exist. The command writes validated article
   and asset records, the actual private asset bytes, and a checksum mapping. It
   reads every file back before reporting success. The bundle can contain drafts
   and must never be committed or attached to a public issue. An interrupted
   export is not a valid backup; inspect and remove its partial destination, then
   rerun to a new empty directory.

5. Record current production URLs, metadata, structured data, headings, links,
   code blocks, images, table of contents, CTA, author box, blog index, and
   sitemap output for both manifest articles.
6. Ensure local Application Default Credentials identify an authorized operator
   and that `.env.local` names the production project and bucket without storing
   any private key.

## Dry run and apply

The command defaults to dry-run. It reads production state but does not write:

```powershell
npm run cms:migrate -- --dry-run
```

Review the JSON report. A clean first run reports two articles and two assets to
create. Any existing record with the same slug or stable ID must either match
the manifest exactly or the command stops without overwriting it.

Apply requires an explicit project confirmation:

```powershell
npm run cms:migrate -- --apply --confirm-project=shruggie-web
```

The importer uploads each verified image, creates its article with an audited
`admin:repository-migration` identity, reads every created article back, and
reports verification. If execution stops after an asset write, rerun the same
command: matching records are preserved and reported as unchanged. A complete
second run must propose and perform no writes.

## Parity and production cutover

Before changing the production authority, compare each Firestore article to its
manifest source and verify:

- slug, title, publication date, author, category, excerpt, and published state;
- heading order, links, fenced code, inline formatting, and rendered meaning;
- featured image bytes, dimensions, checksum, and alternative text;
- canonical URL, Open Graph/Twitter fields, and `BlogPosting` JSON-LD;
- table of contents, syntax highlighting, `PostCTA`, and `AuthorBox`;
- blog index ordering and sitemap inclusion.

Then set `CMS_CONTENT_AUTHORITY=firestore` in Vercel Production and deploy the
reviewed cutover commit. Firestore-authoritative builds do not prerender dynamic
blog slugs, so application builds remain independent of article reads. Verify
both migrated URLs on the deployed site at representative mobile and desktop
widths, then create and publish a temporary post-build slug to confirm ongoing
browser-only publication. Archive or unpublish that verification article after
the evidence is recorded.

## Rollback and recovery

Application rollback and data rollback are separate decisions:

1. If the cutover code is defective but Firestore data is intact, redeploy the
   previous application while leaving the database untouched.
2. If an editorial mutation is wrong, restore an immutable article revision in
   `/admin`; do not edit Firestore directly.
3. If Firestore data is damaged, restore the scheduled backup into a temporary
   database, never over `(default)`. Verify article counts, slug reservations,
   revision order, audit records, asset records, and sample asset checksums.
4. Promote recovered data only after comparison and approval. Remove the
   temporary database after evidence is retained.
5. If Firebase must be exited, use the provider-neutral export and its asset
   checksum mapping to populate a replacement adapter. Page components and the
   article schema remain unchanged.

An emergency repository-authority deployment is deliberately manual and stale:
it exposes only the frozen migration corpus and cannot contain later browser
articles or edits. It is a last-resort read path, not an authoring workflow.

## Completion evidence

Attach only non-sensitive evidence to #29:

- dry-run, apply, read-back, and second-run summaries;
- migration manifest commit and automated test results;
- backup completion and temporary-restore verification, without private data;
- before/after parity results and production screenshots;
- deployed commit and Vercel deployment URL;
- confirmation that Vercel Production uses Firestore authority;
- confirmation that repository edits no longer affect production publication.
