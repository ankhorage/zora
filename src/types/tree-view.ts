import type { ButtonIconSpec } from '@ankhorage/surface';
import type { SelectionIntent } from '@ankhorage/utility/selection';
import type { ReactNode } from 'react';

import type { ZoraBaseProps } from './base';

export interface TreeItemNode<TId extends string = string> {
  id: TId;
  label: ReactNode;
  icon?: ButtonIconSpec;
  expandedIcon?: ButtonIconSpec;
  children?: readonly TreeItemNode<TId>[];
  disabled?: boolean;
  meta?: ReactNode;
  actions?: ReactNode;
}

export interface TreeItemRenderProps<TId extends string = string> {
  node: TreeItemNode<TId>;
  depth: number;
  selected: boolean;
  expanded: boolean;
  hasChildren: boolean;
}

export interface TreeViewProps<TId extends string = string> extends ZoraBaseProps {
  nodes: readonly TreeItemNode<TId>[];
  selectedIds?: readonly TId[];
  expandedIds?: readonly TId[];
  defaultExpandedIds?: readonly TId[];
  onSelect?: (id: TId, intent: SelectionIntent) => void;
  onExpandedChange?: (ids: readonly TId[]) => void;
  renderItem?: (props: TreeItemRenderProps<TId>) => ReactNode;
  expansionIndicator?: 'chevron' | 'folder';
}
