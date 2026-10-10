import React from 'react';

import type { MatrixGridSparseIndex } from '../../application/createMatrixGridSparseIndex';
import { getMatrixGridNextFocusId } from '../../application/getMatrixGridNextFocusId';

/*** Keep one roving focus target and restore it after GridView virtualizes a sparse cell. */
export function useMatrixGridKeyboardFocus(
  index: MatrixGridSparseIndex,
  disabled: boolean,
  visibleIds: readonly string[],
  onNavigate: (targetId: string, originId: string, shiftKey: boolean) => void,
) {
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const focusedRef = React.useRef<string | null>(null);
  const pendingFocusRef = React.useRef<string | null>(null);
  const cellRefs = React.useRef(new Map<string, FocusableCell>());
  const visibleIdSet = React.useMemo(() => new Set(visibleIds), [visibleIds]);
  const tabStopId =
    focusedId !== null && visibleIdSet.has(focusedId)
      ? focusedId
      : visibleIds.find((id) => index.positionById.has(id));

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
      const nextId = getMatrixGridNextFocusId(index, originId, key);
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
    [disabled, index, onNavigate],
  );

  return { focusedId, onFocus, onKeyDown, registerCell, tabStopId };
}

interface FocusableCell {
  focus: () => void;
}
