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
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly ariaLabel?: string;
}

/*** Render the standalone browser TreeView artifact without React Native runtime dependencies. */
export function TreeView<TId extends string = string>(props: TreeViewProps<TId>) {
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<readonly TId[]>(
    props.defaultExpandedIds ?? [],
  );
  const isControlled = props.expandedIds !== undefined;
  const expandedIds = isControlled ? props.expandedIds : internalExpandedIds;
  const handleToggleExpand = React.useCallback(
    (id: TId) => {
      const nextExpandedIds = toggleExpandedIds(expandedIds, id);
      if (!isControlled) setInternalExpandedIds(nextExpandedIds);
      props.onExpandedChange?.(nextExpandedIds);
    },
    [expandedIds, isControlled, props.onExpandedChange],
  );

  return (
    <div
      aria-label={props.ariaLabel ?? 'Tree'}
      className={props.className}
      role="tree"
      style={{ ...TREE_STYLE, ...props.style }}
    >
      {props.nodes.map((node) => (
        <TreeItemRow
          key={node.id}
          depth={0}
          expandedIds={expandedIds}
          node={node}
          onSelect={props.onSelect}
          onToggleExpand={handleToggleExpand}
          renderItem={props.renderItem}
          selectedId={props.selectedId}
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
