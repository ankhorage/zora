import type { ListRowVariant } from './types';

type ListSeparatorKind = 'none' | 'divider' | 'spacer';

export function resolveListSeparator(variant: ListRowVariant, index: number): ListSeparatorKind {
  if (index === 0) return 'none';
  return variant === 'divider' ? 'divider' : 'spacer';
}
