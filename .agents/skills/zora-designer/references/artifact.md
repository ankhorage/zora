# Portable `zora-designer.md` Artifact

`zora-designer.md` is the deterministic design/audit decision record. It is never runtime theme or
manifest authority. The serializer and its ordered frontmatter/section skeleton live in
[audit.ts](../scripts/audit.ts); do not maintain another template.

## Document lifecycle

Use these document statuses:

- `draft`: required decisions or evidence are still unresolved;
- `resolved`: the requested configuration is complete and applicable;
- `resolved-with-gaps`: design decisions are complete but owner/runtime support is not;
- `blocked`: the requested deliverable cannot proceed;
- `audited`: the available evidence has been assessed and limitations are explicit.

Use `documentKind: configuration` for interactive/design/template work and `audit` for an audit.
Generation self-checks belong under validation; do not create a pretend audit.

## Canonical input to the serializer

Provide a JSON object with these responsibilities. Missing optional data stays empty or `null`; it
is never invented:

- `language` and `status`;
- `source`: mode, original inputs, ordered evidence, capability limitations;
- `config`: requested/resolved category, intent, platform target profiles, theme coverage, primary,
  harmony, tone pair, typography, and advanced profile, each with origins;
- `derivation`: owner provenance, diagnostics, assumptions, unsupported concepts, and explicit
  target/runtime drift;
- `tokens`: current owner-computed token output, never copied token definitions;
- `components`: metadata-backed recipe decisions and required states;
- `screens`: ordered screen specifications and evidence relationships;
- `assets`: portable `bundlePath`, completion `status`, and `entries` describing each icon/image,
  region usages, provenance, dimensions and visual review; planned assets remain explicit during
  configuration and must be present for screen/template completion;
- `validation`: scope, gates, application gate, owner/runtime drift, and blockers;
- `auditInput`: criterion and release-gate assessments consumed by the canonical calculator;
- `findings`, `risks`, `openDecisions`, and preserved `userNotes`.

The serializer emits a JSON-compatible YAML frontmatter document with stable key order and a fixed
human-readable section order. JSON is a valid YAML subset and avoids ambiguous scalar coercion.
Never add timestamps, random choices, environment paths, or unstable prose.

## Origin and target/observed rules

Every resolved input records one origin from:

```text
user | session | project | existing-brief | category-default | global-default |
observed | inferred | derived | unknown
```

Current explicit input wins. `derived` means mechanically resolved from separately recorded inputs.
Preserve user notes verbatim. Regenerate derived content rather than retaining obsolete generated
values as compatibility state.

During audits and migrations, declared target configuration and observed implementation remain
separate. Record owner/runtime drift with owner, path, owner value, design target, evidence, failed
gate, and required owner change. A complete target can be `resolved-with-gaps` while application is
blocked.

## Validation states

Validation scopes are `configuration`, `composition`, `runtime`, and `audit`. A gate is
`not-applicable`, `not-assessable`, `pass`, `fail`, or `blocked`. Configuration-only work does not
fail for absent runtime interaction evidence; it marks that scope not applicable.

Aggregate validation in this order: blocker, failure, not run, pass with non-blocking gaps, then
pass. Resolve the application gate separately. A runtime blocker affects aggregate status only when
runtime application is in the requested scope.

Every capability that lacks an exact metadata-supported ZORA element records a non-blocking
capability gap and uses a visible `Box` placeholder in the concept composition. An owner diagnostic
with `severity: error` is a blocker. Record an owner issue link when one exists and the condition
for replacing the placeholder with a released real ZORA element.

## Deterministic audit fields

The audit calculator supplies score, coverage, applicable and assessed weight, rounding policy,
confidence, possible range, release gate and items, complete rule results, findings with allocated
score impact, risks, passed rules, and not-assessable criteria. Keep unavailable scalar values as
`null`; do not omit them or substitute zero.

An image or series records each original source separately with dimensions and order. A URL records
the capture viewport, theme mode, state, and reproduction. Concept images are labeled generated;
runtime captures are labeled observed/measured and include their capture source.

## Output and persistence

Write to an explicit output path when supplied; otherwise update an existing artifact at the target
root or create it there. If the target is not writable, return the complete proposed artifact and
state that it was not persisted.

Before returning, confirm the artifact matches the requested mode, every resolved value has an
origin, owner identifiers were inspected, exact measurements came from tools, invisible behavior
was not passed from screenshots, owner errors block release, capability gaps are explicit, and the
manifest remains canonical runtime authority.
