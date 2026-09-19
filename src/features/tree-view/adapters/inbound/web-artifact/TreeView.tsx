import React from 'react';

import { toggleExpandedIds } from '../../../utils/toggleExpandedIds';

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
export function TreeView<TId extends string = string>({
  nodes,
  selectedId,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  onSelect,
  onExpandedChange,
  renderItem,
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
      style={{ display: 'flex', flexDirection: 'column', minWidth: 0, ...style }}
    >
      {nodes.map((node) => (
        <TreeItemRow
          key={node.id}
          depth={0}
          expandedIds={expandedIds}
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

interface TreeItemRowProps<TId extends string> {
  readonly node: TreeItemNode<TId>;
  readonly depth: number;
  readonly selectedId?: TId;
  readonly expandedIds: readonly TId[];
  readonly onSelect?: (id: TId) => void;
  readonly onToggleExpand: (id: TId) => void;
  readonly renderItem?: (props: TreeItemRenderProps<TId>) => React.ReactNode;
}

/*** Render one recursive browser tree row while keeping selection and expansion independent. */
function TreeItemRow<TId extends string>({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggleExpand,
  renderItem,
}: TreeItemRowProps<TId>) {
  const hasChildren = node.children !== undefined && node.children.length > 0;
  const expanded = expandedIds.includes(node.id);
  const selected = selectedId === node.id;
  const item = renderItem?.({ node, depth, selected, expanded, hasChildren }) ?? (
    <>
      {node.icon === undefined ? null : (
        <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0 }}>
          {node.icon}
        </span>
      )}
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {node.label}
      </span>
      {node.meta === undefined ? null : (
        <span style={{ flexShrink: 0, opacity: 0.65 }}>{node.meta}</span>
      )}
    </>
  );

  return (
    <>
      <div
        aria-disabled={node.disabled || undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        aria-selected={selected}
        onClick={() => {
          if (!node.disabled) onSelect?.(node.id);
        }}
        onKeyDown={(event) => {
          if (node.disabled || (event.key !== 'Enter' && event.key !== ' ')) return;
          event.preventDefault();
          onSelect?.(node.id);
        }}
        role="treeitem"
        tabIndex={node.disabled || onSelect === undefined ? undefined : 0}
        style={{
          alignItems: 'center',
          background: selected ? 'color-mix(in srgb, currentColor 10%, transparent)' : 'transparent',
          borderRadius: 6,
          cursor: node.disabled ? 'default' : onSelect === undefined ? 'inherit' : 'pointer',
          display: 'flex',
          gap: 6,
          minHeight: 28,
          opacity: node.disabled ? 0.5 : 1,
          paddingLeft: depth * 16 + 6,
          paddingRight: 4,
          userSelect: 'none',
        }}
      >
        {item}
        {node.actions === undefined ? null : (
          <span
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            style={{ display: 'inline-flex', flexShrink: 0 }}
          >
            {node.actions}
          </span>
        )}
        {hasChildren ? (
          <button
            aria-label={expanded ? 'Collapse' : 'Expand'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleExpand(node.id);
            }}
            style={{
              alignItems: 'center',
              appearance: 'none',
              background: 'transparent',
              border: 0,
              color: 'inherit',
              cursor: 'pointer',
              display: 'inline-flex',
              flexShrink: 0,
              font: 'inherit',
              height: 24,
              justifyContent: 'center',
              padding: 0,
              width: 24,
            }}
            type="button"
          >
            {expanded ? '⌄' : '›'}
          </button>
        ) : null}
      </div>
      {hasChildren && expanded ? (
        <div role="group">
          {node.children?.map((child) => (
            <TreeItemRow
              key={child.id}
              depth={depth + 1}
              expandedIds={expandedIds}
              node={child}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              renderItem={renderItem}
              selectedId={selectedId}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
