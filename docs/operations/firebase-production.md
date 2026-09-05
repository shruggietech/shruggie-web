# Firebase production operations

The only deployed Firebase environment for this repository is the
`shruggie-web` production project. Architecture and risk decisions are recorded
in [ADR-001](../architecture/adr-001-firebase-editorial-backend.md).

## Resource inventory

| Resource         | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| Project ID       | `shruggie-web`                                         |
| Project number   | `660220401300`                                         |
| Firebase web app | `shruggie-web`                                         |
| Firestore        | `(default)`, `us-east1`, Native mode, Standard edition |
| Storage          | `gs://shruggie-web.firebasestorage.app`, `US-EAST1`    |
| Public domain    | `https://shruggie.tech`                                |

Firestore deletion protection, a daily backup with seven-day retention, bucket
uniform access, bucket public-access prevention, and seven-day bucket soft
delete are enabled. The Firebase browser key is restricted to the production
site and Firebase-hosted authentication handler domains. A USD 5 monthly budget
alerts at USD 1, USD 2.50, and USD 5. Budget alerts do not stop service usage.

## Local development

Use emulators, never production data. Run the application as the emulator
command's child process so it inherits every Firebase emulator host variable:

```bash
npx firebase-tools emulators:exec --project demo-shruggie-web "npm run dev"
```

This starts the configured Auth, Firestore, and Storage emulators, launches the
Next.js development server with their host variables, and stops the emulators
when the application exits. The `demo-shruggie-web` identifier is reserved for
local emulation; it is not a deployed development or beta environment.

The application must fail startup outside Vercel production if a local process
has production Firebase credentials without the expected emulator host
variables. Integration tests should use `demo-shruggie-web` so any request to a
Firebase product that is not emulated fails instead of reaching production.

## Rules deployment

`firestore.rules` and `storage.rules` deny all browser access. Until the admin
authorization boundary is implemented, do not replace them with user-aware
rules and do not enable direct client reads or writes.

After authenticating Firebase CLI with the authorized ShruggieTech Google
account, deploy rules and indexes from the repository root:

```bash
npx firebase-tools deploy --project shruggie-web --only firestore:rules,firestore:indexes,storage
```

Review the generated diff before deployment. The Firebase Admin SDK bypasses
Security Rules, so least-privilege IAM and server-side authorization remain
mandatory.

## Authentication gate

Firebase Authentication is initialized, but no sign-in provider is enabled.
Issue #26 must establish token verification, revocation checks, the explicit
server-side editor allowlist, and canonical-origin enforcement before enabling
a production provider. The `/admin` experience must never expose public
registration.

## Recovery checks

Before migrated content becomes authoritative:

1. confirm the latest scheduled Firestore backup completed;
2. restore it into a temporary database, never over `(default)`;
3. verify article counts, revisions, slug reservations, and audit records;
4. verify the asset manifest and a sample of restored media checksums; and
5. remove the temporary recovery database after the evidence is recorded.

Backups and restores are metered. Storage soft delete and Firestore backup
retention are both seven days, so investigate accidental deletion immediately.
