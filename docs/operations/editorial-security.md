# Editorial security operations

Issue [#26](https://github.com/shruggietech/shruggie-web/issues/26)
establishes the staff-only boundary for the browser editorial platform.

## Identity and roles

Firebase Authentication proves identity, but authorization remains an explicit
server-side ShruggieTech decision. Configure verified Google account emails in
the Vercel production environment:

```text
CMS_EDITOR_EMAILS=editor-one@example.com,editor-two@example.com
CMS_ADMIN_EMAILS=admin@example.com
```

Both lists are case-insensitive. Editors may read drafts and create or update
articles and assets. Administrators have the same content permissions and may
also inspect the editorial audit stream. Neither role may manage the allowlist
from the browser. Removing an email denies its next verified request; use the
Firebase console or Admin SDK to revoke existing refresh tokens when access
must end immediately.

Raw email addresses are used only for the in-memory allowlist comparison. The
application derives a stable `editor:<sha256>` identifier from the Firebase UID
for article revisions and audit records, so content history does not retain an
email address.

## Session boundary

`POST /api/admin/session` accepts a recently authenticated Firebase ID token
from the future #27 sign-in interface. The server checks token revocation,
verified email status, the allowlist, and a five-minute maximum authentication
age before issuing an eight-hour Firebase session cookie. The cookie is
HTTP-only, Secure, `SameSite=Strict`, host-only, and scoped to `/`.

Every protected request verifies the session cookie with revocation checking.
`DELETE /api/admin/session` revokes the account's refresh tokens and clears the
local cookie. Expired, revoked, disabled, removed, or malformed identities fail
closed. Firebase authentication outages return a retryable 503 response and do
not expose draft data.

## Request boundary

All article and asset mutations require an `Origin` header that exactly matches
`CMS_CANONICAL_ORIGIN`, or `NEXT_PUBLIC_SITE_URL` when no override is present.
Non-local origins must use HTTPS. Session cookies also use strict same-site
policy. Request bodies use strict Zod schemas, unknown JSON or multipart fields
are rejected, and response bodies never include credentials or raw provider
errors.

The protected server routes are:

| Route                     | Method          | Required role | Purpose                         |
| ------------------------- | --------------- | ------------- | ------------------------------- |
| `/api/admin/session`      | GET/POST/DELETE | staff         | Inspect, create, or end session |
| `/api/admin/articles`     | GET/POST        | editor        | List drafts or create article   |
| `/api/admin/articles/:id` | GET/PUT         | editor        | Read or update an article       |
| `/api/admin/assets`       | GET/POST        | editor        | List or upload private assets   |
| `/api/admin/audit`        | GET             | administrator | Inspect redacted audit events   |

Browser Firebase SDK access to Firestore and Storage remains denied by
`firestore.rules` and `storage.rules`. Only authenticated Next.js Node.js route
handlers use Firebase Admin.

## Concurrency, replay, and audit

Every article mutation requires a 16–128 character idempotency key and the
expected current revision for updates. The repository includes the verified
actor and role in the idempotency fingerprint, rejects key reuse with different
content or authority, and rejects stale revisions before writing. A retried
request may carry a new correlation ID without defeating idempotent replay.

The article, immutable revision, idempotency record, and immutable
`editorialAudit` event are committed in one Firestore transaction. Events use a
deterministic ID derived from the idempotency key and record only the
pseudonymous actor ID, bounded role, request ID, article ID/revision, server
timestamp, and one of `create`, `edit`, `publish`, `unpublish`, `archive`, or
`restore`. Replaying an identical successful request returns its original
revision without producing a second audit event.

## Production activation checklist

1. Configure `CMS_EDITOR_EMAILS` and `CMS_ADMIN_EMAILS` in Vercel production.
2. Deploy the application and confirm the protected routes deny anonymous,
   unapproved, cross-origin, expired, and revoked requests.
3. Confirm Firestore and Storage rules still deny all browser SDK access.
4. Enable only the Google sign-in provider in Firebase Authentication and keep
   public registration absent from the application.
5. Confirm Firebase authorized domains contain only the production and required
   Firebase authentication handler domains.
6. Sign in with one editor and one administrator, verify role boundaries, then
   revoke the test sessions.

Do not enable the production sign-in provider until the allowlists are known
and steps 1–3 are deployed.
