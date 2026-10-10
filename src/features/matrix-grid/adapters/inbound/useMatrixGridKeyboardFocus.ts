import type { GridMatrixCellPlacement } from '@ankhorage/grid-view';
import React from 'react';

import { getMatrixGridNextFocusId } from '../../application/getMatrixGridNextFocusId';

/*** Keep one roving focus target and restore it after GridView virtualizes a sparse cell. */
export function useMatrixGridKeyboardFocus(
  cells: readonly GridMatrixCellPlacement[],
  disabled: boolean,
  visibleIds: readonly string[],
  onNavigate: (targetId: string, originId: string, shiftKey: boolean) => void,
) {
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const focusedRef = React.useRef<string | null>(null);
  const pendingFocusRef = React.useRef<string | null>(null);
  const cellRefs = React.useRef(new Map<string, FocusableCell>());
  const allIds = React.useMemo(() => cells.map((cell) => cell.id), [cells]);
  const visibleIdSet = React.useMemo(() => new Set(visibleIds), [visibleIds]);
  const tabStopId =
    focusedId !== null && visibleIdSet.has(focusedId)
      ? focusedId
      : visibleIds.find((id) => allIds.includes(id));

  const onFocus = React.useCallback((id: string) => {
    pendingFocusRef.current = null;
    focusedRef.current = id;
    setFocusedId(id);
  }, []);

  const registerCell = React.useCallback((id: string, node: FocusableCell | null) => {
    if (node === null) {
      cellRefs.current.delete(id);
      return;
    }
    cellRefs.current.set(id, node);
    if (pendingFocusRef.current === id) {
      pendingFocusRef.current = null;
      node.focus();
    }
  }, []);

  const onKeyDown = React.useCallback(
    (id: string, key: string, shiftKey: boolean): boolean => {
      if (disabled || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
        return false;
      }
      const originId = focusedRef.current ?? id;
      const nextId = getMatrixGridNextFocusId(cells, originId, key);
      if (nextId === null || nextId === originId) return true;

      focusedRef.current = nextId;
      pendingFocusRef.current = nextId;
      setFocusedId(nextId);
      onNavigate(nextId, originId, shiftKey);

      const mounted = cellRefs.current.get(nextId);
      if (mounted) {
        pendingFocusRef.current = null;
        mounted.focus();
      }
      return true;
    },
    [cells, disabled, onNavigate],
  );

  return { focusedId, onFocus, onKeyDown, registerCell, tabStopId };
}

interface FocusableCell {
  focus: () => void;
}
