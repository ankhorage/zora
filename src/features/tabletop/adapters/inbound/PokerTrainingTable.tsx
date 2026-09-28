import React from 'react';

import type { PokerTrainingTableProps } from '../../../../types/tabletop';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { createPokerTrainingTableState } from '../../utils/createPokerTrainingTableState';
import { TabletopTable } from './TabletopTable';

/*** Maps a serializable training task to presentation without running poker or training policy. */
export const PokerTrainingTable = withZoraThemeScope(PokerTrainingTableInner);

/*** Renders the reconstructed seat ring and shared table content. */
function PokerTrainingTableInner({
  task = {},
  defaultStackBigBlinds = 100,
  accessibilityLabel,
  ...tableProps
}: PokerTrainingTableProps) {
  const state = React.useMemo(
    () => createPokerTrainingTableState(task, { defaultStackBigBlinds }),
    [defaultStackBigBlinds, task],
  );

  return (
    <TabletopTable
      {...tableProps}
      accessibilityLabel={accessibilityLabel ?? state.accessibilityLabel}
      centerCards={state.centerCards}
      centerLabel={state.centerLabel}
      centerSublabel={state.centerSublabel}
      seatCount={state.seatCount}
      seats={state.seats}
    />
  );
}
