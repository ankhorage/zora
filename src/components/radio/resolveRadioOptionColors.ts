import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';

import type { RadioGroupProps } from './types';

/*** Resolve selection-card decoration from the requested semantic role and field state. */
export function resolveRadioOptionColors(
  theme: SurfaceTheme,
  {
    color = 'primary',
    invalid,
    disabled,
  }: Pick<RadioGroupProps<string>, 'color' | 'invalid' | 'disabled'>,
) {
  const roles = new Map<string, RoleSemantics>([
    ['primary', theme.semantics.action.primary],
    ['secondary', theme.semantics.secondary],
    ['tertiary', theme.semantics.accent],
    ['quaternary', theme.semantics.highlight],
    ['neutral', theme.semantics.action.neutral],
    ['danger', theme.semantics.action.danger],
    ['error', theme.semantics.error],
    ['success', theme.semantics.success],
    ['warning', theme.semantics.warning],
    ['info', theme.semantics.info],
  ]);
  const role = roles.get(invalid ? 'error' : color) ?? theme.semantics.action.primary;
  return {
    accent: disabled ? theme.semantics.content.disabled : role.base,
    onAccent: disabled ? theme.semantics.surface.disabled : role.onSolidText,
    border: disabled
      ? theme.semantics.border.subtle
      : invalid
        ? role.outline
        : theme.semantics.border.default,
    surface: disabled ? theme.semantics.surface.disabled : theme.semantics.surface.default,
  };
}
