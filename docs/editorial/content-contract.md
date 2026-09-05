# Editorial content contract

Issue [#25](https://github.com/shruggietech/shruggie-web/issues/25)
establishes the project-owned boundary between routes, repository migration
content, and Firebase. The executable schemas live in `lib/editorial/domain.ts`.

## Article schema v1

Draft, published, and archived articles share one strict schema. Unknown fields
are rejected. Each record includes:

- stable article ID and collision-reserved slug;
- title, excerpt, author ID and name, and category;
- Markdown body with an explicit format discriminator;
- lifecycle state plus creation, modification, and publication timestamps;
- contextual featured-image and optional OG-image references with alt text; and
- a monotonic revision number, prior revision, update time, and editor ID.

Published records require `publishedAt`; draft and archived records must not
have it. `modifiedAt` cannot predate `createdAt`, and the revision timestamp must
match `modifiedAt`. Every update increments the revision exactly once and names
the immediately preceding revision.

## Lifecycle

| From      | Allowed next states        |
| --------- | -------------------------- |
| Draft     | Draft, published, archived |
| Published | Published, draft, archived |
| Archived  | Archived, draft            |

Archived articles must return to draft before publication. Saves use optimistic
concurrency and fail with `REVISION_CONFLICT` when the expected revision is
stale. Slugs are reserved transactionally and collisions fail with
`SLUG_COLLISION` rather than replacing another article.

## Markdown policy

Article content accepts CommonMark plus these GitHub Flavored Markdown
features: tables, task lists, strikethrough, and autolinks. It may use headings,
paragraphs, emphasis, strong text, lists, blockquotes, thematic breaks, links,
images, inline code, and fenced code.

The validator rejects:

- raw HTML or JSX;
- MDX expressions and module imports or exports;
- JavaScript, data, and other unapproved link protocols;
- inline images without meaningful alternative text; and
- inline image URLs that are neither stable project paths nor HTTPS URLs.

Code spans and fenced code remain literal, so examples may contain braces,
HTML, or JavaScript without executing. The maximum UTF-8 body size is 512 KiB.

## Assets

Accepted uploads are JPEG, PNG, WebP, and AVIF images up to 5 MiB and 6000
pixels per dimension. Animated and multi-page files are rejected. The server
uses Sharp to inspect the bytes and dimensions; it does not trust the filename
or declared MIME type.

Storage paths are generated as `articles/{articleId}/{assetId}.{extension}`.
The public contract stores a stable project URL at
`https://shruggie.tech/media/{assetId}` rather than a provider URL. Asset records
also preserve the original filename, detected type, byte size, dimensions,
contextual default alt text, SHA-256 checksum, creation metadata, and private
storage path.

## Adapter boundary

Routes consume `lib/blog.ts`, a project-owned view adapter. During migration it
uses `MdxArticleReader`, which validates repository frontmatter and Markdown
through article schema v1. Firebase SDK objects never cross this boundary.

`FirestoreArticleRepository` implements transactional creates and updates over
the `articles`, `articleSlugs`, `articleRevisions`, `idempotencyKeys`, and
`editorialAudit` collections. Every create or update command carries the
verified pseudonymous actor, bounded role, and request ID; the repository
rejects a revision that attributes the write to a different actor.
`FirebaseAssetStore` validates bytes before writing private objects and records.
Both modules are marked server-only and translate provider failures into
project errors.

| Error code                 | Meaning                                           | Retryable |
| -------------------------- | ------------------------------------------------- | --------- |
| `VALIDATION_FAILED`        | Article or command violates the contract          | No        |
| `ASSET_VALIDATION`         | Upload bytes or metadata violate the asset policy | No        |
| `SLUG_COLLISION`           | Another article owns the slug                     | No        |
| `ASSET_COLLISION`          | Another object owns the stable asset ID           | No        |
| `REVISION_CONFLICT`        | Expected revision is stale                        | No        |
| `INVALID_STATE_TRANSITION` | Requested lifecycle move is not allowed           | No        |
| `NOT_FOUND`                | Requested article is absent                       | No        |
| `CONTENT_TIMEOUT`          | Provider exceeded the operation deadline          | Yes       |
| `CONTENT_UNAVAILABLE`      | Provider or transport is unavailable              | Yes       |

Production Firebase initialization uses Application Default Credentials. No
service-account JSON or private key belongs in the repository or a public
environment variable.

## Export and recovery

`createEditorialExport` produces a versioned JSON snapshot containing every
validated article and asset record. Serialization validates the snapshot again,
sorts records by stable ID, and retains all asset references and checksums. The
export is the provider-neutral input for backup verification, migration, and a
future Firebase exit.
