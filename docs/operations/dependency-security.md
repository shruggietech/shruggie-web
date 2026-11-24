# Production dependency security

Issue [#42](https://github.com/shruggietech/shruggie-web/issues/42)
established the production dependency-security baseline. Issue
[#102](https://github.com/shruggietech/shruggie-web/issues/102) tracks the
November 2026 remediation.

## Required release check

Run the production-only audit before release:

```bash
npm audit --omit=dev
```

High and critical findings block release. Moderate findings require a written
dependency path, upstream constraint, exposure assessment, and follow-up
condition. Never use `npm audit fix --force`; review and test each direct
dependency change.

## November 2026 remediation

- Next.js and `eslint-config-next` are aligned on 16.4.6. Sharp resolves to
  0.35.5, `@vercel/oidc` to 4.0.9, and Zod to 4.6.7. The lockfile also
  refreshes the affected transitive packages.
- The browser Firebase SDK still brings in `@firebase/firestore` with a
  `~1.9.0` range for `@grpc/grpc-js`. The scoped override resolves this
  dependency to patched 1.14.7. Recheck the override when the Firebase
  browser SDK updates. Remove it when the upstream Firestore range allows
  a patched version, then rerun the production audit and editorial tests.
- Firebase Admin 14.5.1 declares support for Google Cloud Storage `^8.1.0`.
  The application now shares Storage 8.4.0 with Firebase Admin, clearing the
  earlier production UUID advisory. The refreshed lockfile reports zero
  production advisories.

## September 2026 remediation

- Next.js and `eslint-config-next` were upgraded together from 16.1.6 to
  16.3.4. This removes the reported Next.js, bundled PostCSS, and bundled Sharp
  findings while retaining Node.js 22 and React 19 compatibility.
- `gray-matter` 4.0.3 accepts `js-yaml` `^3.13.1`, but the existing lockfile
  retained vulnerable 3.14.2. A package override pins that compatible path to
  patched 3.15.1.

## September 2026 Firebase advisory (resolved)

The moderate advisory followed this production path:

```text
firebase-admin 14.3.0
└── @google-cloud/storage 7.22.0
    ├── gaxios 6.7.1
    │   └── uuid 9.0.1
    └── teeny-request 9.0.0
        └── uuid 9.0.1
```

The advisory affects UUID v3/v5/v6 calls when a caller supplies an output
buffer. ShruggieTech does not call those UUID APIs. The packages used this path
internally for Google transport requests. At the time, the audit remediation
required Storage 8.0.1 and Firebase Admin 14.3.0 declared `^7.22.0`. The
project kept that supported range until the November upgrade.

## September 2026 development-only Firebase CLI advisories

The full audit also reported moderate findings beneath the
`firebase-tools` 15.29.0 development dependency. They included
`@google-cloud/pubsub` → `@opentelemetry/core`, `stream-json`, and the CLI's
Express/body-parser → `qs` paths. This CLI is used only by authorized
contributors for local emulators and explicit deployments; it is excluded from
the production audit and production application bundle.

The project used Firebase Tools 15.29.0 at the time. npm suggested a forced
downgrade to 10.1.1, which would have crossed several years of Firebase CLI
behavior. Keep emulator inputs local and trusted. Recheck these paths on
Firebase Tools updates and review the current full audit separately from
the production release gate.
