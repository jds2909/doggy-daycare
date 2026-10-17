# Dependency and security review

Review date: 17 October 2026

## npm audit result

`npm audit` reports five high-severity vulnerable package entries, all in the
development-only ESLint dependency chain:

```text
eslint-config-next@16.4.1 (direct dev dependency)
└─ @next/eslint-plugin-next@16.4.1
   └─ fast-glob@3.3.1
      └─ micromatch@4.0.8
         └─ braces@3.0.3
```

The five entries arise from one root advisory,
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm):
`braces` can exhaust the JavaScript stack when it processes a maliciously deeply
nested glob pattern. npm propagates that advisory through every affected parent,
which is why it counts five highs rather than five independent flaws.

| Audit entry | Dependency type | Assessment and action |
| --- | --- | --- |
| `braces@3.0.3` | Transitive development dependency | Root vulnerable package. No patched npm release currently exists; monitor the advisory and upstream package. |
| `micromatch@4.0.8` | Transitive development dependency | Reported because it uses `braces`. Upgrade when it adopts a patched version. |
| `fast-glob@3.3.1` | Transitive development dependency | Reported through `micromatch`. Its current release still accepts the affected micromatch range. |
| `@next/eslint-plugin-next@16.4.1` | Transitive development dependency | Used by linting and affected only through the glob chain. Keep aligned with the installed Next.js release. |
| `eslint-config-next@16.4.1` | Direct development dependency | Top-level audit entry. npm proposes `14.2.35`, which is a major downgrade and is not an appropriate fix for a Next.js 16 project. |

`npm audit --omit=dev` reports zero vulnerabilities. The deployed application
does not include this lint-only chain, and public input is not used as an ESLint
glob pattern. Practical production exposure therefore appears low. The remaining
risk is availability during local or CI linting if a deliberately hostile glob
pattern is introduced into developer-controlled tooling.

No dependency was changed during this review. The safest path is to wait for a
patched `braces` release and compatible upstream dependency updates, then update
`eslint-config-next` alongside the matching Next.js version and run the complete
test, lint and build checks. A future compatible patch release should be
non-breaking, but npm's currently suggested downgrade is breaking and should not
be applied. Do not use `npm audit fix --force` for this finding.

## Response headers

The application previously relied on platform defaults. Because the site has an
authenticated admin area containing customer and dog-care records, basic global
browser hardening is worthwhile. The following low-risk headers are now set in
`next.config.ts`:

- `X-Frame-Options: DENY` to prevent the public and admin interfaces being framed
  for clickjacking.
- `X-Content-Type-Options: nosniff` to disable MIME-type guessing.
- `Referrer-Policy: strict-origin-when-cross-origin` to limit cross-origin URL
  information while retaining same-origin diagnostics.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` because the
  current application uses none of those browser capabilities.

A full Content Security Policy was not added. Next.js script handling requires a
carefully tested nonce or hash strategy, and a rushed policy could break the
application. HSTS was also left to the HTTPS deployment layer because its domain
and subdomain implications should be confirmed against production hosting before
being committed in application code.
