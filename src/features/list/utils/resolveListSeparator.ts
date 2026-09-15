import type { ListItemVariant } from '../../../types/list';

export type ListSeparatorKind = 'none' | 'divider' | 'spacer';

/*** Resolves the separator preceding an item for the active list presentation. */
export function resolveListSeparator(variant: ListItemVariant, index: number): ListSeparatorKind {
  if (index === 0) return 'none';
  return variant === 'divider' ? 'divider' : 'spacer';
}
