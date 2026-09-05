# ADR-001: Firebase editorial backend

- Status: Accepted
- Date: 2026-09-05
- Decision owner: ShruggieTech
- Authorizing issue: [#24](https://github.com/shruggietech/shruggie-web/issues/24)
- Parent initiative: [#23](https://github.com/shruggietech/shruggie-web/issues/23)

## Context

Blog authors currently edit MDX files in the repository. Publishing therefore
requires repository access, a pull request, and a deployment. The intended
editorial group is only two to four people, posts are published infrequently,
and ShruggieTech does not want a paid third-party CMS subscription or a second
hosted environment.

The replacement must provide browser-based drafts and publishing, media
management, revisions, auditability, secure preview, and prompt cache
invalidation while keeping the existing Next.js application on Vercel.

## Decision

Use one production Firebase project named `shruggie-web`. Keep the public site
and the project-owned `/admin` experience in the existing Next.js application.
Use Firebase Authentication for editor identity, Cloud Firestore for editorial
records, and Cloud Storage for Firebase for private article media.

There is no deployed development or beta project. Local development and
integration tests use the Firebase Emulator Suite with the `demo-shruggie-web`
project identifier; they must not connect to production services.

Cloud Firestore is the only writable content authority after cutover. Existing
MDX files are migration inputs and a recovery export, not a second authoring
surface. Once migration is verified, changes to `content/blog` do not publish
or override Firestore records.

## Alternatives considered

| Criterion                      | Custom Firebase                                        | Hosted headless CMS               | Self-hosted Payload                                 | Git-backed browser CMS                           |
| ------------------------------ | ------------------------------------------------------ | --------------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| Editor experience              | Project-owned, focused UI                              | Mature vendor UI                  | Mature customizable UI                              | Familiar form UI                                 |
| Browser publish without Git    | Yes                                                    | Yes                               | Yes                                                 | No; commits remain the publish source            |
| Next.js 16 and Draft Mode      | Direct adapter and route integration                   | Supported through SDK/webhooks    | Supported after framework compatibility work        | Preview and deploy workflow remain Git-oriented  |
| Revisions and audit            | Explicit Firestore model                               | Usually built in                  | Built in/customizable                               | Git history, weak editorial audit semantics      |
| Asset management               | Private Cloud Storage bucket                           | Built in                          | Requires persistent object storage                  | Repository or external asset store               |
| Operating model                | Serverless, usage-metered, no CMS subscription         | Recurring SaaS dependency         | Database, storage, upgrades, and hosting to operate | Low service cost but retains repository workflow |
| Portability                    | Project-owned adapter plus exportable documents/assets | Vendor export quality varies      | Good, but application and database must be operated | High for text, coupled to Git/deploys            |
| Maintenance                    | Small custom surface                                   | Lowest code maintenance           | Highest infrastructure maintenance                  | Low, but does not meet the publishing outcome    |
| Fit for 2–4 occasional editors | Selected                                               | More product and cost than needed | More operations than needed                         | Fails the no-Git publishing requirement          |

Sanity was the strongest hosted-CMS option but was rejected because the project
does not want another paid product dependency. Payload was the strongest
self-hosted option but adds a continuously maintained application and database,
and its current Next.js baseline is ahead of this repository. Decap CMS was
rejected because Git remains the content authority and new posts still depend
on repository writes and deployment behavior.

## Production topology

| Concern                         | Production choice                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| Google Cloud / Firebase project | `shruggie-web` (`660220401300`)                                                              |
| Firebase web app                | `shruggie-web` (`1:660220401300:web:9c1db908200c18e0458681`)                                 |
| Public application              | Existing Vercel deployment at `https://shruggie.tech`                                        |
| Database                        | Firestore `(default)`, Native mode, Standard edition, `us-east1`                             |
| Media                           | `gs://shruggie-web.firebasestorage.app`, `US-EAST1`                                          |
| Authentication                  | Firebase Authentication; provider remains disabled until the server allowlist is implemented |
| Local development               | Auth, Firestore, and Storage emulators only                                                  |

The Firestore database has deletion protection enabled and point-in-time
recovery disabled. The media bucket uses uniform bucket-level access, enforced
public-access prevention, and seven-day soft delete. A USD 5 monthly project
budget sends current-spend alerts at 20%, 50%, and 100%; alerts are not a hard
spending cap.

## Security boundary

Browser clients do not read Firestore drafts or write Firestore or Cloud Storage
directly. The deployed rules deny every client SDK operation. Authenticated
Next.js Route Handlers perform editorial operations through the Firebase Admin
SDK and must:

1. verify the Firebase ID token and its revocation state;
2. reject identities outside an explicit server-side editor allowlist;
3. enforce the canonical production origin for mutations;
4. parse strict Zod request contracts and reject unknown fields;
5. require an idempotency key for mutations;
6. compare an expected monotonic article revision;
7. commit the article, immutable revision, and redacted audit event in one
   Firestore transaction; and
8. revalidate only the affected Next.js cache tags and paths after commit.

No sign-in provider may be enabled before steps 1–3 exist. The admin UI will not
offer public registration. Long-lived Google service-account keys must not be
committed; the deployment should use workload identity federation where the
Vercel account supports it, with a narrowly scoped service account as the
fallback.

## Content and asset model

The initial collections are:

- `articles`: canonical current state keyed by stable article ID;
- `articleSlugs`: unique slug reservation and lookup records;
- `articleRevisions`: immutable snapshots keyed by article ID and revision;
- `editorialAudit`: append-only, redacted mutation records; and
- `idempotencyKeys`: bounded mutation replay records with expiry timestamps.

Article records include lifecycle state, slug, title, summary, structured body,
author reference, SEO metadata, featured-image reference and alt text,
publication timestamps, and an integer revision. Storage object names use
stable generated asset IDs rather than author-provided filenames. Upload routes
enforce an allowlist of image MIME types and extensions, maximum byte and pixel
dimensions, and required alternative text before an asset can be published.

## Preview and publication lifecycle

Draft preview begins at a server-only route that verifies the editor, creates a
short-lived preview grant, enables Next.js Draft Mode, and redirects to the
canonical article route. Public article queries return only published records.

Publishing, updating, unpublishing, and restoring a revision are transactional
mutations. After a successful commit, the application calls `revalidateTag` for
the article and blog index plus `revalidatePath` for the affected article,
listing, sitemap, and feed surfaces. Failed revalidation is retryable and does
not roll back the authoritative Firestore commit.

## Caching, outages, and recovery

The project-owned content adapter is the only module allowed to translate
Firestore documents into the public blog domain model. Public reads use the
Next.js Data Cache and tagged revalidation. A transient Firestore failure must
serve the last successfully cached published representation when available and
show an explicit unavailable state otherwise; draft and admin operations fail
closed.

Firestore managed backups or exports are metered and are not covered by the
database's free quota. A daily managed backup with seven-day retention is
configured; before migrated content becomes authoritative, test a restore into
a temporary database. The media bucket's seven-day soft-delete window covers
accidental deletion; a periodic manifest and object export provides the vendor
exit path. Recovery tests must verify documents, assets, revision ordering, and
slug uniqueness.

The exit format is newline-delimited JSON for documents and their revision
metadata, plus original media objects and a checksum manifest. The adapter
boundary allows a later provider to replace Firebase without changing page
components or editorial contracts.

## Knox.Dance patterns

Reuse these platform patterns from the private `shruggietech/knoxdance`
repository:

- strict Zod contracts and canonical-origin checks;
- explicit server-side authentication and authorization;
- idempotency keys, transactions, and monotonic revisions;
- redacted or pseudonymized audit events;
- explicit outage and degraded states; and
- emulator and production-like integration tests.

Do not copy Knox.Dance's organizer claims and proposal workflow, repository
curation bridge, or local maintainer CLI. Those solve a different domain and
would enlarge this editorial surface without benefit.

## Delivery sequence

The existing child order remains valid:

1. [#25](https://github.com/shruggietech/shruggie-web/issues/25) defines the
   provider-independent content contracts and adapter.
2. [#26](https://github.com/shruggietech/shruggie-web/issues/26) implements
   authentication, authorization, preview, and the server mutation boundary.
3. [#27](https://github.com/shruggietech/shruggie-web/issues/27) builds the
   editor workspace, article lifecycle, revisions, and asset workflow.
4. [#28](https://github.com/shruggietech/shruggie-web/issues/28) migrates MDX
   content and verifies backups, restore, and vendor exit.
5. [#29](https://github.com/shruggietech/shruggie-web/issues/29) performs the
   final security, accessibility, performance, and production release gates.

## Consequences

This decision avoids a fixed CMS subscription and an always-on backend. At the
expected workload, Authentication, Firestore, and Storage should generally stay
inside no-cost usage allowances. Cloud Storage for Firebase nevertheless
requires a billing-enabled Blaze project, and backups, restores, and overages
are metered. The project therefore accepts tightly monitored usage charges but
not a third-party CMS subscription.

ShruggieTech owns more application code than with a hosted CMS. The small user
count and article-only scope make that trade acceptable, provided the adapter,
transaction, audit, recovery, and authorization boundaries above are treated as
release requirements rather than optional refinements.
