import React from 'react';

/*** Draw a compact expansion or folder/file indicator without adding an icon runtime dependency. */
export function TreeExpansionIndicator({
  expanded,
  hasChildren,
  variant,
}: {
  readonly expanded: boolean;
  readonly hasChildren: boolean;
  readonly variant: 'chevron' | 'folder';
}) {
  if (variant === 'chevron' && !hasChildren) return null;
  const path =
    variant === 'chevron'
      ? expanded
        ? 'm5 8 5 5 5-5'
        : 'm8 5 5 5-5 5'
      : !hasChildren
        ? 'M5 2h6l4 4v12H5z M11 2v5h4'
        : expanded
          ? 'M2 7V4h6l2 2h8v2 M2 8h17l-3 9H2z'
          : 'M2 4h6l2 2h8v11H2z';
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d={path} />
    </svg>
  );
}
