import type { InteractionPolicy } from '@ankhorage/surface';
import type { SelectionIntent } from '@ankhorage/utility/selection';
import type React from 'react';

import type { ZoraBaseProps } from './base';

export type SelectionMode = 'single' | 'multi';

export type SelectionTrigger = 'press' | 'longPress' | 'manual';

export interface SelectionProviderProps {
  children: React.ReactNode;
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  mode?: SelectionMode;
  disabled?: boolean;
  onSelectionChange?: (ids: readonly string[]) => void;
  interactionPolicy?: InteractionPolicy;
}

export interface UseSelectionResult {
  mode: SelectionMode;
  disabled: boolean;
  selectedIds: readonly string[];
  selectedCount: number;
  hasSelection: boolean;
  isSelected: (id: string) => boolean;
  activate: (id: string, intent: SelectionIntent) => void;
  select: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
}

export interface SelectableItemState {
  id: string;
  selected: boolean;
  disabled: boolean;
  mode: SelectionMode;
  activate: (intent: SelectionIntent) => void;
  select: () => void;
  toggle: () => void;
  clear: () => void;
}

export interface SelectableItemProps extends ZoraBaseProps {
  id: string;
  trigger?: SelectionTrigger;
  disabled?: boolean;
  interactionPolicy?: InteractionPolicy;
  children: React.ReactNode | ((state: SelectableItemState) => React.ReactNode);
}
