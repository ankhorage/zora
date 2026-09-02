# Evidence-Aware Design Audit

The canonical rubric, weights, criterion keys, status factors, confidence factors, and release-gate
inventory live in [audit-rubric.json](../assets/audit-rubric.json). The calculation implementation
in [audit.mjs](../scripts/audit.mjs) loads that file. Do not reproduce either list or the arithmetic
in prompts, references, tests, or application code.

Inspect the current catalog when needed:

```text
bun .agents/skills/zora-designer/scripts/audit.mjs catalog
```

## Evidence intake

Every evidence item has a stable ID, kind, location or screen/viewport/state, precise observation,
evidence level, confidence and factor, reproduction steps, and limitations. Preserve URL capture
parameters and ordered image-series position.

Use these evidence levels:

- `measured`: reproducible source, computed runtime value, accessibility tree, instrumented test, or
  reliable tool output;
- `observed`: clearly visible behavior or high-resolution visual evidence;
- `estimated`: approximate measurement with a known scale or compositing limitation;
- `inferred`: plausible intent without direct proof;
- `not-assessable`: the source cannot demonstrate the criterion.

Confidence is explicit, not inferred from the evidence-level word. High-confidence computed runtime
evidence and medium-confidence design metadata can both be measured in different senses.

A visual-only audit may assess composition, hierarchy, apparent typography, approximate spacing,
visible states, and color risk. It cannot positively verify semantic names, keyboard or focus order,
screen-reader announcements, responsive reflow, text scaling, target dimensions without a trusted
scale, loading feedback, recovery behavior, or performance.

## Criterion assessment

Assess all canonical criteria from the rubric asset. For each criterion record:

- `applicable` and why;
- `status` using the asset's canonical status keys;
- `evidenceIds` and the non-empty `essentialEvidenceIds` needed to reproduce any assessed status;
- `confidenceFactor` equal to the minimum factor among essential evidence;
- `reason`.

Unavailable evidence is `not-assessable`, not inapplicable. A criterion is inapplicable only when
the product or audited scope genuinely has no such responsibility.

Repeated instances influence severity and remediation but do not create repeated deductions. Map
one root cause to one primary criterion and cross-reference related rules without scoring them
again. C.R.A.P., visual dominance, implementation quality, performance, and user testing are useful
cross-checks or delivery gates, not extra weighted rules.

Run deterministic calculation through `calculateAudit` or the audit CLI. It derives rule totals,
score, evidence coverage, possible range, aggregate confidence, release items, and the aggregate
release gate from the canonical asset. Do not hand-calculate or round intermediate values.

Interpretation rules:

- A non-null score always appears with coverage, confidence, and possible range.
- Low coverage makes the score provisional even when the score is high.
- Confidence describes evidence quality; coverage describes how much applicable rubric weight was
  assessed.
- No applicable criteria yields null score, coverage, range, and confidence.
- Applicable but wholly unassessed criteria yield null score, zero coverage, and a 0–100 range.
- The numerical score never overrides a failed or unassessed release gate.

## Release gates

Populate every canonical release item and subcriterion from the asset. Missing evidence does not
make a release subcriterion inapplicable. One item fails if any applicable subcriterion fails,
passes only when at least one applies and all applicable subcriteria pass, and remains
`not-assessable` when applicable evidence is incomplete. The aggregate gate fails on any item
failure and passes only when all applicable items pass.

Any confirmed applicable WCAG A/AA failure, keyboard trap, inaccessible core task, unrecoverable
destructive flow, owner diagnostic blocker, or equivalent critical blocker fails the relevant gate
even if the weighted score is high. This compact gate is not a formal WCAG conformance claim.

## Findings, risks, and remediation

A scored finding contains a stable ID, primary rule and criterion, severity, location, evidence,
evidence level, expected result, user/task impact, deduplicated root cause, non-scoring related
rules, smallest useful fix, verification, confidence, evidence IDs, and script-allocated score
impact. Exact colors, ratios, selectors, and dimensions require measurement.

Plausible but unconfirmed concerns are non-scoring risks. Each risk records its signal, evidence
level, confidence, possible impact, and verification needed. It cannot lower the score or fail a
release gate until evidence promotes it to a finding.

Prioritize remediation in this order:

1. release-gate, accessibility, safety, and core-task blockers;
2. shared owner tokens or components that resolve multiple findings;
3. major hierarchy, form, navigation, and recovery problems;
4. localized usability and consistency issues;
5. aesthetic polish.

Improve the owning shared primitive before patching instances or inventing a Studio-only path.
