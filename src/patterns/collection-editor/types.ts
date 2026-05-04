import type React from 'react';

export interface CollectionEditorRenderItemProps<TItem> {
  item: TItem;
  index: number;
  remove: () => void;
  moveUp: () => void;
  moveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface CollectionEditorProps<TItem> extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: readonly TItem[];
  renderItem: (props: CollectionEditorRenderItemProps<TItem>) => React.ReactNode;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  onMove?: (from: number, to: number) => void;
  addLabel?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  disabled?: boolean;
}
