import type React from 'react';

export type SelectionMode = 'single' | 'multi';

export type SelectionTrigger = 'press' | 'longPress' | 'manual';

export interface SelectionProviderProps {
  children: React.ReactNode;
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  mode?: SelectionMode;
  disabled?: boolean;
  onSelectionChange?: (ids: readonly string[]) => void;
}

export interface UseSelectionResult {
  mode: SelectionMode;
  disabled: boolean;
  selectedIds: readonly string[];
  selectedCount: number;
  hasSelection: boolean;
  isSelected: (id: string) => boolean;
  select: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
}

export interface SelectableItemState {
  id: string;
  selected: boolean;
  disabled: boolean;
  mode: SelectionMode;
  select: () => void;
  toggle: () => void;
  clear: () => void;
}

export interface SelectableItemProps {
  id: string;
  trigger?: SelectionTrigger;
  disabled?: boolean;
  children: React.ReactNode | ((state: SelectableItemState) => React.ReactNode);
}
