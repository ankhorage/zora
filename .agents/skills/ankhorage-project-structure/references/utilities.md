# Utility Ownership and Unknown-Value Narrowing

Classify a helper before creating or moving it:

```text
cross-repository, framework-neutral -> @ankhorage/utility/<category>
cross-domain inside one package      -> src/utils/<functionName>.ts
one domain only                      -> src/<domain>/utils/<functionName>.ts
semantic/domain behavior             -> owning domain, not utils
```

Do not retain local copies while waiting for a Utility release. Follow the Utility repository's
current PR, merge, release, and dependency-update workflow.

## Strong cross-repository candidates

Generic object and unknown-value operations commonly belong in focused Utility subpaths:

```text
@ankhorage/utility/object
  readOwnProperty
  setOwnProperty
  deleteOwnProperty
  isRecord

@ankhorage/utility/value
  asString
  asNumber
  asRecord
```

Create public utilities only after confirming repetition and stable semantics across repositories.
Do not move feature payload parsers, provider response semantics, or domain validation merely
because they contain small type guards.

## Absence and failure semantics

Use consistent meanings:

- `isRecord(value)` returns a type-guard boolean.
- `asRecord(value)` returns the narrowed record or `undefined`.
- `asString(value)` returns the string or `undefined`.
- `readOwnProperty(target, key)` returns the owned value or `undefined`.
- `parse<DomainValue>(value)` returns an explicit domain parse result when callers need to
  distinguish absent, invalid, and valid values.

Reserve `null` for an intentional domain or serialized value. Do not use `null` as the generic
failure result for type narrowing when `undefined` expresses absence. When failure details matter,
use a discriminated result instead of alternating between `null` and `undefined`.

## Avoid false utilities

Keep these with their owner:

- `readProjectDeployConfig`
- `readSecretPayload`
- `parseStudioModuleState`
- API response validation with feature-specific error policy
- helpers that encode manifest, route, auth, deploy, or provider semantics

A utility is not a place to hide complexity or shorten a file. It must represent a reusable,
cohesive capability with stable behavior.
