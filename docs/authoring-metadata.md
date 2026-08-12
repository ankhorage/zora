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

Instance authority is reserved for legitimate per-node content, behavior, or semantics. For example, a Heading owns its text, semantic level, translation key, and optional line clamp per instance. Its size, color, emphasis, alignment, weight, and italic presentation remain component-theme concerns.

Theme authority prevents visual design props from becoming unrelated per-instance overrides. Internal or technical props have no `authoring` property. There is no `system` authority.

## Theme recipe direction

```text
Global theme tokens
  -> ZORA component or pattern recipe
  -> rendered ZORA component or pattern
```

Recipe fields may reference shared token families such as colors, spacing, radii, typography, and shadows. Semantic choices remain recipe-specific: a Button `size: m` does not imply the same geometry as another component's `size: m`.

This metadata defines the authoring contract. Theme administration and concrete recipe resolution are downstream consumers and must not move into the concrete component registry.

## Theme recipe runtime precedence

Theme recipe metadata is the canonical schema for theme-authorable component and pattern defaults. Persisted `ThemeConfig.recipes` stores selected values only. Runtime precedence is:

```text
component hard behavior
  <- ZORA recipe metadata default
  <- persisted ThemeConfig recipe override
  <- explicit component instance prop (when allowInstanceOverride is true)
```

Unknown persisted fields are ignored as stale metadata; invalid values for known fields fail explicitly. Token fields must reference a token that exists in the field's declared family. New manifest blueprints do not copy theme-owned defaults into instance props, so theme changes remain inherited.

`ZoraProvider` can receive a canonical `themeConfig`; nested scopes preserve that complete config so authored global tokens and recipes are not lost. The legacy `theme` seed remains supported for standalone consumers and is converted once at the provider boundary.
