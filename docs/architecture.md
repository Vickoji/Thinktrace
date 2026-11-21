# ThinkTrace architecture and experimental workflow

## Implementation boundary

Phase 1 provides a Next.js application, a responsive interface built with React, TypeScript, Tailwind CSS and shadcn/ui components, and a Supabase account and access model. A visitor can read the study design before creating an account. Account creation provides access to a workspace. It does not enroll anyone in research. The task, intervention, consent and export modules below are designs for subsequent phases. An operational study requires academic supervision, institutional review and a reviewed protocol before recruitment.

## Identity and authorization in Phase 1

Supabase Auth owns `auth.users`, including the email used for sign-in. A database trigger provisions a `public.account_roles` row for each new user. Its primary key `user_id` references the Auth user with cascading deletion. The constrained `role` field defaults to `participant`. An administrator grants `researcher` access through a trusted database connection. The application never derives that role from a participant's self-description, email domain or editable user metadata.

At `/auth`, a server action sends a Supabase email code. A second action verifies that code and establishes a cookie-backed session using `@supabase/ssr`. The request proxy refreshes the session. At `/workspace`, the server verifies the user with Supabase Auth and looks up the role using that user's ID. If the role lookup fails, the workspace displays an access error and withholds role-specific content. Sign-out ends the current session.

The server uses the caller's session and a Supabase publishable key. PostgreSQL row-level security restricts each authenticated user to reading their own role. Clients have no role-write privileges. Account roles describe application access. Future access to identifiable records, exports or a particular study needs a separate authorization decision scoped to that study.

## Proposed module boundaries

| Module | Responsibility and trust boundary |
| --- | --- |
| Experiment management | A researcher versions the hypothesis, consent text, eligible tasks, answer keys, condition definitions, assessment schedule and retention policy. Opening a new version must preserve the treatment definition used by earlier participants. |
| Participant interface and task engine | The browser renders an assigned item and validates input for usability. The server verifies the caller, enrollment, consent version, assigned item, phase and prior submissions. It timestamps and scores the accepted submission against the frozen task version. |
| Intervention engine | A server-only service reads the assigned condition, constructs its prompt from permitted task fields and calls a provider adapter. It returns the intervention and records its provenance. Condition selection and task gating belong to the study protocol, independently of the provider. |
| Behavioral events | The server appends study events as part of accepted domain transitions. Capture task presentation, initial submission, successful AI delivery and final submission. The study excludes background browsing, screen capture and private conversations. |
| Analytics and exports | Analysis runs over a versioned research extract. Include eligible denominators, participant and item counts, missingness and uncertainty. A study-scoped permission check and disclosure review precede release. |
| Administration | An administrator provisions researcher access. A designated study custodian manages re-identification for withdrawals, consent amendments, retention and export auditing. Keep privileged credentials out of browser bundles. |

Deployable units can remain a single Next.js app, Supabase Auth and PostgreSQL. Host Python analysis separately from interactive requests. Introduce Supabase Storage only for a defined artifact that needs it, such as an approved, expiring extract in a private bucket. The Phase 1 application has no dependency on an LLM, Python service or object store to sign in.

## Proposed research data model

Only `auth.users` and `public.account_roles` in this document describe the Phase 1 account model. The following entities describe the target relational design for later migrations.

| Entity | Keys and constraints to preserve |
| --- | --- |
| Study and protocol version | Each frozen protocol belongs to one study and identifies consent version, intervention configuration, retention duration and eligible task sets. Study membership maps approved researchers to explicit scopes. |
| Enrollment and identity link | Generate an opaque enrollment ID per study. Keep the account-to-enrollment mapping in a restricted identity schema. Link experimental records by enrollment ID. Enforce one active enrollment per account and protocol as required by the design. |
| Consent and withdrawal | Record the approved information-sheet version, decision and timestamp. Store withdrawal state and time. Check this state on reads for export, data collection and provider dispatch. Record the scope of any data already irreversibly anonymized in the consent materials. |
| Assignment and schedule | Persist one condition and one counterbalancing schedule per enrollment. Bind the allocation to the frozen protocol. Concurrent retries must reuse the recorded assignment. Model counterbalancing separately from intervention condition. |
| Task version and scheduled item | Bind each presentation to a stable item revision, assessment wave, ordering and scoring rule. Keep answer keys server-side. Use matched sets across conditions and independent assessment waves. |
| Attempt, intervention and reflection | Store initial and final answer, explanation, confidence, submission times and attempt status. Preserve the initial submission after acceptance. Associate the actual AI exposure, model settings, condition-specific responses and reflection with the same attempt. A failed AI request must leave a resumable attempt. |
| Event, export and retention records | Use bounded event types, server timestamps and idempotency keys. Record extract version, requesting researcher, inclusion rules and disclosure review. Define expiry for identity links, free text, responses and artifacts, including backup expiry. |

Personal practice should use its own storage and authorization path with no implicit research enrollment. An internal row-level extract carrying stable participant IDs is pseudonymous. Public release requires disclosure review, including checking rare combinations and small cells. Exclude identifying linkage, raw explanations and provider prompts from default exports. Keep free text out of application logs.

## Experimental workflow and treatment definition

1. Present the approved information sheet. Record explicit consent. Run the baseline assessment without an AI endpoint or access to scoring feedback.
2. Allocate the participant to an eligible condition and a counterbalanced task sequence using a server-side transaction. Persist both before serving the first intervention item.
3. Open a scheduled item. Collect an independent answer, explanation and confidence from 0 to 100. Save the accepted initial response before granting access to assistance.
4. Apply the assigned assistance. Conventional assistance presents an answer and explanation on request. Metacognitive assistance elicits uncertainty and introduces relevant counterarguments. Structured reflection requires the participant to identify evidence, weaknesses and alternatives after receiving the AI response.
5. Collect the final decision, explanation and confidence and offer a brief reflection. Record skipped or unavailable assistance distinctly from rejecting advice. Use assignment for the primary analysis and actual exposure for descriptive follow-up.
6. Run matched post-test and optional delayed assessments independently. Freeze the extract and scoring rules, account for withdrawals and report results with sample sizes, missingness and uncertainty intervals.

All three conditions in this workflow make an initial independent commitment. Comparing them identifies differences between assistance formats following that commitment. To estimate the effect of **requiring independent thought before access**, a separate approved design needs an immediate-access arm. In that arm, collecting a mandatory pre-AI answer would alter the treatment. Mark initial-answer outcomes structurally missing for those items and use common independent assessments to compare arms. Keep model version, available evidence, task difficulty and scoring comparable. Specify how revisions that match AI advice will be distinguished from explicit acceptance.

## Provider changes and retries

The proposed server-side adapter accepts an intervention request containing only the approved task context, reasoning excerpt and generation settings. It returns the participant-visible text, provider and model version, prompt template revision and request status. Server configuration selects the adapter. Prompt design belongs to the protocol layer so a provider swap does not require changing task collection or scoring. A protocol revision should record any swap during a study. Disclose the permitted provider data flow during consent and verify the provider's retention terms before use.

Reserve a request against a unique attempt and intervention step before sending it. A retry may return the saved output or resume an explicitly failed step. Treat a timeout after dispatch as an unknown delivery outcome. Count an exposure only when the application has a defined delivery event. Recheck withdrawal before serving any late result.

## Verification by phase

| Phase | Checks before advancing |
| --- | --- |
| 1. Architecture, UI and authentication | Production build, responsive navigation, email sign-in and sign-out, protected workspace redirects, own-row role access and denied client role writes. See the project testing notes for which checks ran. |
| 2. Cognitive Decision Lab | Item validation, immutable initial answers, confidence bounds, server timestamps, concurrent submissions and independent-assessment isolation. |
| 3. Interventions | Run each condition against a deterministic test adapter. Check preconditions, prompt provenance, provider errors, retries and structured-reflection gating. |
| 4. Behavioral data and analytics | Check event idempotency and consent boundaries. Validate accuracy, revisions, response times and the Brier score against hand-calculated fixtures, including missing confidence and unanswered items. |
| 5. Research management and exports | Test allocation under concurrency, counterbalancing, study-specific access, consistent CSV/JSON outputs, withdrawal during an active session and retention enforcement. |
| 6. Statistical validation | Run the analysis from a frozen extract and check clustering, missingness, reliability, uncertainty and the preregistered estimand using independently checked examples. |
| 7. Deployment | Rehearse migrations, authentication email delivery, backup restoration, approved processor configuration and withdrawal handling in a staging study. |
