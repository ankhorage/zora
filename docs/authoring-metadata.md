# ZORA authoring metadata

ZORA owns three separate public registries with different responsibilities:

```text
ZORA_COMPONENT_REGISTRY
  concrete React components used by renderers

ZORA_COMPONENT_META
  serializable component props, events, slots, requirements, blueprints, and authoring authority

ZORA_THEME_RECIPE_META
  serializable component and pattern theme recipe definitions
```

Neither component metadata nor theme recipe metadata contains React components. Runtime and Studio consume these registries; they do not recreate or merge ZORA ownership.

## Prop authoring authority

A prop participates in authoring only when its schema has `authoring` metadata.

```ts
{ authority: 'instance' }
{ authority: 'theme', scope: 'global' | 'component' | 'pattern' }
```

Instance authority is reserved for legitimate per-node content or behavior. Theme authority prevents visual design props from becoming unrelated per-instance overrides. Internal or technical props have no `authoring` property. There is no `system` authority.

## Theme recipe direction

```text
Global theme tokens
  -> ZORA component or pattern recipe
  -> rendered ZORA component or pattern
```

Recipe fields may reference shared token families such as colors, spacing, radii, typography, and shadows. Semantic choices remain recipe-specific: a Button `size: m` does not imply the same geometry as another component's `size: m`.

This metadata defines the authoring contract. Theme administration and concrete recipe resolution are downstream consumers and must not move into the concrete component registry.
