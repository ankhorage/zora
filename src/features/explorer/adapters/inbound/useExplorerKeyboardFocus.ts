import React from 'react';

import type { ExplorerItem } from '../../../../types/explorer';
import { getExplorerNextFocusId } from '../../application/getExplorerNextFocusId';

/*** Tracks the one keyboard tab stop and restores focus only after a virtualized tile mounts. */
export function useExplorerKeyboardFocus(
  items: readonly ExplorerItem[],
  columns: number,
  disabled: boolean,
  visibleIds: readonly string[],
  onNavigate: (targetId: string, originId: string, shiftKey: boolean) => void,
) {
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const focusedRef = React.useRef<string | null>(null);
  const pendingFocusRef = React.useRef<string | null>(null);
  const tileRefs = React.useRef(new Map<string, FocusableTile>());
  const ids = React.useMemo(() => items.map(({ id }) => id), [items]);
  const disabledIds = React.useMemo(
    () => new Set(items.filter((item) => item.disabled).map(({ id }) => id)),
    [items],
  );
  const visibleEligibleIds = visibleIds.filter((id) => ids.includes(id) && !disabledIds.has(id));
  const tabStopId =
    focusedId !== null && visibleEligibleIds.includes(focusedId)
      ? focusedId
      : visibleEligibleIds[0] ?? ids.find((id) => !disabledIds.has(id));

  const onFocus = React.useCallback((id: string) => {
    pendingFocusRef.current = null;
    focusedRef.current = id;
    setFocusedId(id);
  }, []);

  const registerTile = React.useCallback((id: string, node: FocusableTile | null) => {
    if (node === null) {
      tileRefs.current.delete(id);
      return;
    }
    tileRefs.current.set(id, node);
    if (pendingFocusRef.current === id) {
      pendingFocusRef.current = null;
      node.focus();
    }
  }, []);

  const onKeyDown = React.useCallback(
    (id: string, key: string, shiftKey: boolean): boolean => {
      if (disabled) return false;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key))
        return false;
      const originId = focusedRef.current ?? id;
      const nextId = getExplorerNextFocusId(ids, originId, key, columns, disabledIds);
      if (nextId === null || nextId === originId) return true;

      focusedRef.current = nextId;
      pendingFocusRef.current = nextId;
      setFocusedId(nextId);
      onNavigate(nextId, originId, shiftKey);

      const mounted = tileRefs.current.get(nextId);
      if (mounted) {
        pendingFocusRef.current = null;
        mounted.focus();
      }
      return true;
    },
    [columns, disabled, disabledIds, ids, onNavigate],
  );

  return { focusedId, tabStopId, onFocus, onKeyDown, registerTile };
}

interface FocusableTile {
  focus: () => void;
}
