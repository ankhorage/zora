# UI and Design-System Libraries

ZORA and Surface are layered reusable UI libraries, not hexagonal applications. From an
application's perspective, they help build the inbound UI adapter; internally they use component
ownership and dependency direction rather than application ports and use cases.

## Recommended layers

```text
src/
  foundation/
  theme/
  layout/
  primitives/
  components/
  patterns/
  registry/
  internal/
  index.ts
```

Use only the layers owned by the package. Surface and ZORA must not duplicate the same abstraction.

Dependency direction moves from composed UI toward stable foundations:

```text
patterns -> components -> primitives/foundation
patterns -> layout -> foundation
components -> theme -> foundation
registry -> component/pattern metadata
```

Lower layers do not import higher layers. Components do not import the global registry.

## Component ownership

Colocate artifacts that change with the component:

```text
components/
  Button/
    Button.tsx
    Button.types.ts
    Button.metadata.ts
    Button.test.tsx
```

Keep a component as a single file while it has one homogeneous responsibility. Introduce its
directory when tests, metadata, platform variants, styles, or private helpers justify it.

Component-specific authoring metadata belongs beside the component. Registry composition may be
central, but metadata must not become a parallel model detached from implementation and props.

## Patterns

Patterns are reusable UI solutions, not application use cases. Group substantial collections by
UI capability:

```text
patterns/
  auth/
  content/
  navigation/
  onboarding/
  settings/
```

A pattern may accept state, values, errors, and callbacks. It must not execute Supabase, HTTP,
filesystem, deployment, or application authorization behavior.

## Platform behavior

Keep provider and platform execution in the owning adapter package unless it is an unavoidable
peer-backed UI implementation. Prefer injected values/callbacks and platform-neutral component
contracts. Expo Runtime and provider packages own application/platform integration.

Do not introduce `domain`, `application`, `ports`, or `adapters` for ordinary components. A complex
subsystem such as an editor, canvas, or data grid may use internal model/platform boundaries when
real complexity warrants them.
