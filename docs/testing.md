# Phase 1 validation

Run checks from the repository root using Node 24 and the pinned packages installed by `npm ci`.

| Command | Behavior exercised |
| --- | --- |
| `npm test` | Input handling for email addresses and leading-zero codes, provider configuration and transport restrictions. |
| `npm run typecheck` | App Router route types and strict TypeScript checks on server, UI and browser tests. |
| `npm run build` | Production compilation, route generation, self-hosted fonts and CSS processing. |
| `npm run test:e2e` | Public guides, study navigation, intervention controls and the redirect for an unauthenticated workspace visitor. |
| `E2E_LOCAL_AUTH=1 npm run test:e2e` | Includes a local email request, reading the delivered code from Mailpit, verification, a persisted session and sign-out. |
| `npm run test:db` | Tests the migration on local PostgreSQL, including own-row reads, forbidden client writes, trusted role assignment and deletion. |

Start the local backend with `npm run backend:start` before running database and OTP tests. Use an isolated developer database with the app pointed at its local API. The OTP test creates a synthetic account and reads a local mailbox. The SQL tests roll back their transaction. Playwright starts Next.js when a server is absent from port 3000.

The [analysis notebook](../analysis/README.md) can run separately with its constructed self-test. Notebook execution checks its calculations and input handling. Evidence for a research hypothesis requires approved participant data and the prespecified analysis.

Before a hosted pilot, validate code delivery with the actual SMTP sender, exercise account provisioning on that project's database and check role permissions. Research-specific gates for later phases are listed in the [architecture](architecture.md).
