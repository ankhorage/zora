import type { ButtonIconSpec } from '@ankhorage/surface';
import type { ReactNode } from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface TreeItemNode<TId extends string = string> {
  id: TId;
  label: ReactNode;
  icon?: ButtonIconSpec;
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
  selectedId?: TId;
  expandedIds?: readonly TId[];
  defaultExpandedIds?: readonly TId[];
  onSelect?: (id: TId) => void;
  onExpandedChange?: (ids: readonly TId[]) => void;
  renderItem?: (props: TreeItemRenderProps<TId>) => ReactNode;
}
