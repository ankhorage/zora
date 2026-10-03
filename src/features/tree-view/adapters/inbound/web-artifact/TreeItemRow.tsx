import type { SelectionIntent } from '@ankhorage/utility/selection';
import React from 'react';

import { resolveSelectionEventIntent } from '../../../../selection/application/resolveSelectionEventIntent';
import { TreeExpansionIndicator } from './TreeExpansionIndicator';
import type { TreeItemNode, TreeItemRenderProps } from './TreeView';

/*** Render one recursive browser tree row while keeping selection and expansion independent. */
export function TreeItemRow<TId extends string>(props: TreeItemRowProps<TId>) {
  const { node } = props;
  const hasChildren = node.children !== undefined && node.children.length > 0;
  const expanded = props.expandedIds.includes(node.id);
  const selected = props.selectedIds.includes(node.id);
  const content = props.renderItem?.({
    node,
    depth: props.depth,
    selected,
    expanded,
    hasChildren,
  }) ?? (
    <TreeItemDefaultContent
      expanded={expanded}
      node={node}
      showIcon={props.expansionIndicator === 'chevron'}
    />
  );

  return (
    <>
      <div
        aria-disabled={node.disabled === true ? true : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        aria-selected={selected}
        onPointerUp={(event) => selectNode(event, props)}
        onClick={(event) => selectNodeFromSyntheticClick(event, props)}
        onKeyDown={(event) => selectNodeFromKeyboard(event, props)}
        role="treeitem"
        tabIndex={node.disabled || props.onSelect === undefined ? undefined : 0}
        style={createRowStyle(props.depth, selected, node.disabled, props.onSelect !== undefined)}
      >
        <TreeItemExpander
          disabled={node.disabled}
          expanded={expanded}
          indicator={props.expansionIndicator}
          hasChildren={hasChildren}
          nodeId={node.id}
          onToggleExpand={props.onToggleExpand}
        />
        {content}
        <TreeItemActions actions={node.actions} />
      </div>
      {hasChildren && expanded ? <TreeItemChildren {...props} /> : null}
    </>
  );
}

interface TreeItemRowProps<TId extends string> {
  readonly node: TreeItemNode<TId>;
  readonly depth: number;
  readonly expansionIndicator: 'chevron' | 'folder';
  readonly selectedIds: readonly TId[];
  readonly expandedIds: readonly TId[];
  readonly onSelect?: (id: TId, intent: SelectionIntent) => void;
  readonly onToggleExpand: (id: TId) => void;
  readonly renderItem?: (props: TreeItemRenderProps<TId>) => React.ReactNode;
}

/*** Render the default browser tree-row label, icon, and metadata. */
function TreeItemDefaultContent<TId extends string>({
  expanded,
  node,
  showIcon,
}: {
  readonly expanded: boolean;
  readonly node: TreeItemNode<TId>;
  readonly showIcon: boolean;
}) {
  const icon = expanded ? (node.expandedIcon ?? node.icon) : node.icon;
  return (
    <>
      {!showIcon || icon === undefined ? null : (
        <span aria-hidden="true" style={ICON_STYLE}>
          {icon}
        </span>
      )}
      <span style={LABEL_STYLE}>{node.label}</span>
      {node.meta === undefined ? null : <span style={META_STYLE}>{node.meta}</span>}
    </>
  );
}

/*** Isolate optional row actions so their pointer and keyboard events do not select the tree item. */
function TreeItemActions({ actions }: { readonly actions?: React.ReactNode }) {
  if (actions === undefined) return null;
  return (
    <span
      onClick={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      style={INLINE_STYLE}
    >
      {actions}
    </span>
  );
}

/*** Render the independent expansion control for a tree row with children. */
function TreeItemExpander<TId extends string>(props: {
  readonly disabled?: boolean;
  readonly expanded: boolean;
  readonly indicator: 'chevron' | 'folder';
  readonly hasChildren: boolean;
  readonly nodeId: TId;
  readonly onToggleExpand: (id: TId) => void;
}) {
  const indicator = (
    <TreeExpansionIndicator
      expanded={props.expanded}
      hasChildren={props.hasChildren}
      variant={props.indicator}
    />
  );
  if (!props.hasChildren)
    return (
      <span aria-hidden="true" style={EXPANDER_STYLE}>
        {indicator}
      </span>
    );
  return (
    <button
      aria-label={props.expanded ? 'Collapse' : 'Expand'}
      disabled={props.disabled}
      onKeyDown={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        props.onToggleExpand(props.nodeId);
      }}
      style={EXPANDER_STYLE}
      type="button"
    >
      {indicator}
    </button>
  );
}

/*** Render expanded descendants recursively. */
function TreeItemChildren<TId extends string>(props: TreeItemRowProps<TId>) {
  return (
    <div role="group">
      {props.node.children?.map((child) => (
        <TreeItemRow {...props} key={child.id} depth={props.depth + 1} node={child} />
      ))}
    </div>
  );
}

/*** Select a row from pointer activation when it is interactive. */
function selectNode<TId extends string>(
  event: React.PointerEvent<HTMLDivElement>,
  props: TreeItemRowProps<TId>,
) {
  if (props.node.disabled) return;
  props.onSelect?.(props.node.id, resolveSelectionEventIntent(event, 'pointer'));
}

/*** Select a row from assistive or synthetic click activation without duplicating pointer clicks. */
function selectNodeFromSyntheticClick<TId extends string>(
  event: React.MouseEvent<HTMLDivElement>,
  props: TreeItemRowProps<TId>,
) {
  if (event.detail !== 0 || props.node.disabled) return;
  props.onSelect?.(props.node.id, resolveSelectionEventIntent(event, 'keyboard'));
}

/*** Select a row from keyboard activation while preserving native navigation keys. */
function selectNodeFromKeyboard<TId extends string>(
  event: React.KeyboardEvent<HTMLDivElement>,
  props: TreeItemRowProps<TId>,
) {
  if (props.node.disabled || (event.key !== 'Enter' && event.key !== ' ')) return;
  event.preventDefault();
  props.onSelect?.(props.node.id, resolveSelectionEventIntent(event, 'keyboard'));
}

/*** Resolve browser row presentation from the interaction state. */
function createRowStyle(
  depth: number,
  selected: boolean,
  disabled: boolean | undefined,
  selectable: boolean,
): React.CSSProperties {
  return {
    ...ROW_STYLE,
    background: selected ? 'color-mix(in srgb, currentColor 10%, transparent)' : 'transparent',
    cursor: disabled ? 'default' : selectable ? 'pointer' : 'inherit',
    opacity: disabled ? 0.5 : 1,
    paddingLeft: depth * 16 + 6,
  };
}

const ROW_STYLE = {
  alignItems: 'center',
  borderRadius: 6,
  display: 'flex',
  gap: 6,
  minHeight: 28,
  paddingRight: 4,
  userSelect: 'none',
} as const satisfies React.CSSProperties;

const INLINE_STYLE = {
  display: 'inline-flex',
  flexShrink: 0,
} as const satisfies React.CSSProperties;

const ICON_STYLE = INLINE_STYLE;

const LABEL_STYLE = {
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const satisfies React.CSSProperties;

const META_STYLE = {
  flexShrink: 0,
  opacity: 0.65,
} as const satisfies React.CSSProperties;

const EXPANDER_STYLE = {
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
} as const satisfies React.CSSProperties;
