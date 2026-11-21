# Proposed research extract, version 1

Phase 1 establishes the application foundation. This specification describes the intended analytics input for later collection and export work. The notebook accepts UTF-8 CSV with the following columns. Deliver a **single experiment version** per extract; store its protocol version, keyed item versions, model/prompt version, form definitions, scoring method, extraction time and withdrawal cutoff in an access-controlled manifest. JSON exports should use the same field names, JSON numbers for numeric fields and `null` for missing fields.

One row represents one scheduled task for a randomized, consented study enrollment. Include a row with blank observations for a scheduled task that was skipped or never reached. This keeps denominators visible. Include assigned participants even if all their scheduled outcomes are missing. Exclude practice, withdrawn records where required, direct identifiers, access tokens, raw text and exact timestamps. Rotate participant codes between studies and releases. Treat linkable coded extracts as restricted until institutional disclosure review confirms they are suitable for sharing.

| Field | Definition |
| --- | --- |
| `participant_id` | Random opaque study-specific export code. Together with `phase` and `task_id` identifies one scheduled task. |
| `condition` | Original random assignment, `conventional`, `metacognitive` or `structured_reflection`. Same for every row belonging to one participant, including their baseline rows. |
| `phase` | `baseline`, `training`, `post` or `follow_up`. AI only during training. |
| `task_id` | Versioned item identifier within a frozen task set, with a distinct ID per planned presentation. |
| `form_sequence` | Order of the parallel baseline and post-test forms, such as `AB` or `BA`. |
| `initial_choice`, `final_choice` | Opaque answer option codes on objectively scored tasks. Unaided assessment outcomes use initial fields only. A skipped observation is blank. |
| `initial_correct`, `final_correct` | `0` or `1` from frozen objective answer key. Blank if unscored or unavailable. |
| `initial_confidence`, `final_confidence` | Integer 0–100, elicited probability that the corresponding chosen option is correct. Blank if inapplicable or absent. |
| `ai_shown` | `1` if assistance was displayed and `0` otherwise. A zero includes unreached tasks. |
| `ai_choice` | Single codable recommendation actually displayed to the participant. Blank if not displayed or ambiguous. |
| `initial_seconds` | Nonnegative elapsed seconds from presentation to independent submission, derived before export. Blank when either event is missing. |

The protected source tables will also need consent version/time, withdrawal/retention status, original assignment, task-form schedule, versioned scoring keys, append-only initial/final submissions, assistance delivery receipts and reflection/rubric records. Retain exact times and identity links only for approved operational needs. Suppress disclosure-prone cells and review rare answer patterns before anonymous release. Use only reviewed, scoped extracts for analysis.
