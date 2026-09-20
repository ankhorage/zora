import React from 'react';

import { toggleExpandedIds } from '../../../utils/toggleExpandedIds';
import { TreeItemRow } from './TreeItemRow';

export interface TreeItemNode<TId extends string = string> {
  readonly id: TId;
  readonly label: React.ReactNode;
  readonly icon?: React.ReactNode;
  readonly children?: readonly TreeItemNode<TId>[];
  readonly disabled?: boolean;
  readonly meta?: React.ReactNode;
  readonly actions?: React.ReactNode;
}

export interface TreeItemRenderProps<TId extends string = string> {
  readonly node: TreeItemNode<TId>;
  readonly depth: number;
  readonly selected: boolean;
  readonly expanded: boolean;
  readonly hasChildren: boolean;
}

export interface TreeViewProps<TId extends string = string> {
  readonly nodes: readonly TreeItemNode<TId>[];
  readonly selectedId?: TId;
  readonly expandedIds?: readonly TId[];
  readonly defaultExpandedIds?: readonly TId[];
  readonly onSelect?: (id: TId) => void;
  readonly onExpandedChange?: (ids: readonly TId[]) => void;
  readonly renderItem?: (props: TreeItemRenderProps<TId>) => React.ReactNode;
  readonly expansionIndicator?: 'chevron' | 'folder';
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly ariaLabel?: string;
}

/***
 * Render the standalone browser TreeView artifact without React Native runtime dependencies.
 * @config expansionIndicator Use `chevron` beside custom node icons, or `folder` (default) for
 * built-in folder/file indicators. Expansion is leading and independent from row selection.
 */
export function TreeView<TId extends string = string>({
  nodes,
  selectedId,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  onSelect,
  onExpandedChange,
  renderItem,
  expansionIndicator = 'folder',
  className,
  style,
  ariaLabel = 'Tree',
}: TreeViewProps<TId>) {
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<readonly TId[]>(
    defaultExpandedIds ?? [],
  );
  const isControlled = controlledExpandedIds !== undefined;
  const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds;
  const handleToggleExpand = React.useCallback(
    (id: TId) => {
      const nextExpandedIds = toggleExpandedIds(expandedIds, id);
      if (!isControlled) setInternalExpandedIds(nextExpandedIds);
      onExpandedChange?.(nextExpandedIds);
    },
    [expandedIds, isControlled, onExpandedChange],
  );

  return (
    <div
      aria-label={ariaLabel}
      className={className}
      role="tree"
      style={{ ...TREE_STYLE, ...style }}
    >
      {nodes.map((node) => (
        <TreeItemRow
          key={node.id}
          depth={0}
          expandedIds={expandedIds}
          expansionIndicator={expansionIndicator}
          node={node}
          onSelect={onSelect}
          onToggleExpand={handleToggleExpand}
          renderItem={renderItem}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}

const TREE_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
} as const satisfies React.CSSProperties;
