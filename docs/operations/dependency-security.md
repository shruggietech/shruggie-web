# Production dependency security

Issue [#42](https://github.com/shruggietech/shruggie-web/issues/42)
establishes the current production dependency-security baseline.

## Required release check

Run the production-only audit before release:

```bash
npm audit --omit=dev
```

High and critical findings block release. Moderate findings require a written
dependency path, upstream constraint, exposure assessment, and follow-up
condition. Never use `npm audit fix --force`; review and test each direct
dependency change.

## September 2026 remediation

- Next.js and `eslint-config-next` were upgraded together from 16.1.6 to
  16.3.4. This removes the reported Next.js, bundled PostCSS, and bundled Sharp
  findings while retaining Node.js 22 and React 19 compatibility.
- `gray-matter` 4.0.3 accepts `js-yaml` `^3.13.1`, but the existing lockfile
  retained vulnerable 3.14.2. A package override pins that compatible path to
  patched 3.15.1.

## Temporarily accepted Firebase advisory

The remaining moderate advisory follows this production path:

```text
firebase-admin 14.3.0
└── @google-cloud/storage 7.22.0
    ├── gaxios 6.7.1
    │   └── uuid 9.0.1
    └── teeny-request 9.0.0
        └── uuid 9.0.1
```

The advisory affects UUID v3/v5/v6 calls when a caller supplies an output
buffer. ShruggieTech does not call those UUID APIs; the packages use this path
internally for Google transport requests. The available audit remediation is
`@google-cloud/storage` 8.0.1, but Firebase Admin 14.3.0 currently declares the
supported optional range as `^7.22.0`. Forcing Storage 8 or UUID 11 would cross
upstream major-version constraints without Firebase support.

Recheck this exception whenever `firebase-admin` or `@google-cloud/storage` is
updated and during every dependency-security review. Remove the exception as
soon as Firebase Admin supports a Storage release whose UUID dependency is
patched. Any change that exposes direct UUID v3/v5/v6 buffer calls, or any
increase to high or critical severity, invalidates this acceptance immediately.

## Development-only Firebase CLI advisories

The full audit also reports moderate findings beneath the current
`firebase-tools` 15.29.0 development dependency. They include
`@google-cloud/pubsub` → `@opentelemetry/core`, `stream-json`, and the CLI's
Express/body-parser → `qs` paths. This CLI is used only by authorized
contributors for local emulators and explicit deployments; it is excluded from
the production audit and production application bundle.

Firebase Tools 15.29.0 is the current release used by the project. npm's
suggested forced remediation is a downgrade to 10.1.1, which is not an
appropriate security upgrade and would cross several years of Firebase CLI
behavior. Keep emulator inputs local and trusted, never import untrusted
emulator snapshots, and recheck these paths on every Firebase Tools release.
Remove each exception when the CLI updates the affected transitive dependency.

After the reviewed in-range lockfile refresh, both the production-only and full
dependency audits contain zero high or critical findings. The remaining
moderate findings are limited to the constrained production Storage path and
the development-only Firebase CLI paths documented above.
