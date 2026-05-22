import React from 'react';

import { areIdsEqual, clearIds, normalizeIds, selectId, toggleId } from './resolveSelectionNextIds';
import type { SelectionMode, SelectionProviderProps, UseSelectionResult } from './types';

const MISSING_CONTEXT_MESSAGE =
  'ZORA selection context is missing. Wrap this tree in <SelectionProvider>.';

type SelectionContextValue = UseSelectionResult;

const SelectionContext = React.createContext<SelectionContextValue | null>(null);

function resolveMode(mode: SelectionMode | undefined): SelectionMode {
  return mode ?? 'single';
}

function resolveDisabled(disabled: boolean | undefined): boolean {
  return disabled ?? false;
}

/***
 * Accesses selection state provided by `SelectionProvider`.
 *
 * @readme
 */
export function useSelection(): UseSelectionResult {
  const value = React.useContext(SelectionContext);
  if (!value) {
    throw new Error(MISSING_CONTEXT_MESSAGE);
  }

  return value;
}

/***
 * Provides selection state for building selectable lists and grids.
 *
 * @readme
 */
export function SelectionProvider({
  children,
  selectedIds,
  defaultSelectedIds,
  mode,
  disabled,
  onSelectionChange,
}: SelectionProviderProps) {
  const resolvedMode = resolveMode(mode);
  const resolvedDisabled = resolveDisabled(disabled);
  const isControlled = selectedIds !== undefined;

  const [uncontrolledIds, setUncontrolledIds] = React.useState<readonly string[]>(
    defaultSelectedIds ?? [],
  );

  const rawIds = isControlled ? selectedIds : uncontrolledIds;
  const currentNormalizedIds = normalizeIds(rawIds, resolvedMode);

  const selectedIdSet = React.useMemo(() => new Set(currentNormalizedIds), [currentNormalizedIds]);

  const commitSelectionChange = React.useCallback(
    (nextNormalizedIds: readonly string[]) => {
      if (resolvedDisabled) return;
      if (areIdsEqual(nextNormalizedIds, currentNormalizedIds)) return;

      onSelectionChange?.(nextNormalizedIds);

      if (!isControlled) {
        setUncontrolledIds(nextNormalizedIds);
      }
    },
    [currentNormalizedIds, isControlled, onSelectionChange, resolvedDisabled],
  );

  const clear = React.useCallback(() => {
    commitSelectionChange(normalizeIds(clearIds(), resolvedMode));
  }, [commitSelectionChange, resolvedMode]);

  const select = React.useCallback(
    (id: string) => {
      const nextIds = selectId({ mode: resolvedMode, ids: currentNormalizedIds, id });
      const nextNormalizedIds = normalizeIds(nextIds, resolvedMode);
      commitSelectionChange(nextNormalizedIds);
    },
    [commitSelectionChange, currentNormalizedIds, resolvedMode],
  );

  const toggle = React.useCallback(
    (id: string) => {
      const nextIds = toggleId({ mode: resolvedMode, ids: currentNormalizedIds, id });
      const nextNormalizedIds = normalizeIds(nextIds, resolvedMode);
      commitSelectionChange(nextNormalizedIds);
    },
    [commitSelectionChange, currentNormalizedIds, resolvedMode],
  );

  const value = React.useMemo<UseSelectionResult>(() => {
    return {
      mode: resolvedMode,
      disabled: resolvedDisabled,
      selectedIds: currentNormalizedIds,
      selectedCount: currentNormalizedIds.length,
      hasSelection: currentNormalizedIds.length > 0,
      isSelected: (id: string) => selectedIdSet.has(id),
      select,
      toggle,
      clear,
    };
  }, [clear, currentNormalizedIds, resolvedDisabled, resolvedMode, select, selectedIdSet, toggle]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}
