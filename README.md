# ThinkTrace

ThinkTrace is a research platform under development for studying how people reason before and after consulting AI. Phase 1 implements a public study guide, a responsive interface, passwordless account access and role provisioning. Research participation requires a separate, approved enrollment process in a later phase.

## Run Phase 1

Use Node 24, npm and Docker for the local Supabase stack. Python 3.12 is used for the analysis notebook. From the repository root run

```sh
npm ci
npm run backend:start
npm run dev
```

Use `npm run backend:stop` to stop the local services between sessions. The app listens on port 3000. The public research guide runs with just the first and last commands. To validate a local account, open Account access, enter a development email address, retrieve the code from the local mail inbox on port 54324 and submit it. The workspace displays the role stored in PostgreSQL. Sign out and revisit the workspace to check the access boundary.

The project uses Supabase Auth and the caller's database permissions. On a hosted development instance, apply the migration in `supabase/migrations`, enable email sign-in, configure SMTP, and set the confirmation and magic-link email templates to include `{{ .Token }}` as in `supabase/templates/code.html`. Supply `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` as runtime variables for Next.js. A service-role key is unnecessary. New accounts receive the participant role. A database administrator can grant researcher access by updating the matching user ID in `public.account_roles`.

## Development checks

```sh
npm test
npm run typecheck
npm run build
npm run test:e2e
```

To exercise the email round trip on a local developer stack, run `E2E_LOCAL_AUTH=1 npm run test:e2e`. The browser suite uses the system Chromium when available. On another machine, install Chromium with `npx playwright install chromium` or point `CHROMIUM_PATH` at a compatible installation. See [testing](docs/testing.md) for SQL and notebook validation.

## Research and design

- [Architecture and database design](docs/architecture.md)
- [Research problem, hypotheses, experimental protocol and counterbalancing](docs/research/protocol.md)
- [Literature review outline with primary sources](docs/research/literature.md)
- [Analysis plan, scoring rules and power planning](docs/research/analysis-plan.md)
- [Consent template for institutional review](docs/research/consent-template.md)
- [Data dictionary and operational definitions](docs/research/data-dictionary.md)
- [Reproducible Python notebook](analysis/reasoning.ipynb)

The planned experiment compares three assistance formats following an independent answer. A common unaided post-test measures transfer. Estimating the effect of requiring a prior answer itself needs a protocol with an immediate-access comparator. Seek academic supervision and institutional review before recruiting participants.
