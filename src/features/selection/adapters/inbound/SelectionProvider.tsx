import { applySelectionIntent, type SelectionIntent } from '@ankhorage/utility/selection';
import React from 'react';

import type {
  SelectionMode,
  SelectionProviderProps,
  UseSelectionResult,
} from '../../../../types/selection';
import { areIdsEqual, clearIds, normalizeIds, selectId } from '../../utils/resolveSelectionNextIds';

const MISSING_CONTEXT_MESSAGE =
  'ZORA selection context is missing. Wrap this tree in <SelectionProvider>.';

type SelectionContextValue = UseSelectionResult;

const SelectionContext = React.createContext<SelectionContextValue | null>(null);

/*** Resolve the effective selection mode. */
function resolveMode(mode: SelectionMode | undefined): SelectionMode {
  return mode ?? 'single';
}

/*** Resolve the effective disabled state. */
function resolveDisabled(disabled: boolean | undefined): boolean {
  return disabled ?? false;
}

/*** Accesses selection state provided by `SelectionProvider`. */
export function useSelection(): UseSelectionResult {
  const value = React.use(SelectionContext);
  if (!value) throw new Error(MISSING_CONTEXT_MESSAGE);
  return value;
}

/*** Provides selection state for building selectable lists and grids. */
export function SelectionProvider({
  children,
  selectedIds,
  defaultSelectedIds,
  mode,
  disabled,
  onSelectionChange,
  interactionPolicy,
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
      if (resolvedDisabled || interactionPolicy === 'passive') return;
      if (areIdsEqual(nextNormalizedIds, currentNormalizedIds)) return;
      onSelectionChange?.(nextNormalizedIds);
      if (!isControlled) setUncontrolledIds(nextNormalizedIds);
    },
    [currentNormalizedIds, interactionPolicy, isControlled, onSelectionChange, resolvedDisabled],
  );

  const clear = React.useCallback(() => {
    commitSelectionChange(normalizeIds(clearIds(), resolvedMode));
  }, [commitSelectionChange, resolvedMode]);

  const select = React.useCallback(
    (id: string) => {
      const nextIds = selectId({ mode: resolvedMode, ids: currentNormalizedIds, id });
      commitSelectionChange(normalizeIds(nextIds, resolvedMode));
    },
    [commitSelectionChange, currentNormalizedIds, resolvedMode],
  );

  const toggle = React.useCallback(
    (id: string) => {
      const nextIds = applySelectionIntent(currentNormalizedIds, id, 'toggle');
      commitSelectionChange(normalizeIds(nextIds, resolvedMode));
    },
    [commitSelectionChange, currentNormalizedIds, resolvedMode],
  );

  const activate = React.useCallback(
    (id: string, intent: SelectionIntent) => {
      const effectiveIntent = resolvedMode === 'single' ? 'replace' : intent;
      const nextIds = applySelectionIntent(currentNormalizedIds, id, effectiveIntent);
      commitSelectionChange(normalizeIds(nextIds, resolvedMode));
    },
    [commitSelectionChange, currentNormalizedIds, resolvedMode],
  );

  const value = React.useMemo<UseSelectionResult>(
    () => ({
      mode: resolvedMode,
      disabled: resolvedDisabled,
      selectedIds: currentNormalizedIds,
      selectedCount: currentNormalizedIds.length,
      hasSelection: currentNormalizedIds.length > 0,
      isSelected: (id: string) => selectedIdSet.has(id),
      activate,
      select,
      toggle,
      clear,
    }),
    [
      activate,
      clear,
      currentNormalizedIds,
      resolvedDisabled,
      resolvedMode,
      select,
      selectedIdSet,
      toggle,
    ],
  );

  return <SelectionContext value={value}>{children}</SelectionContext>;
}
