import type { TabletopSeatCount } from '../../../types/tabletop';

type TabletopSeatPositionValue = `${number}%`;

interface TabletopSeatPosition {
  readonly top: TabletopSeatPositionValue;
  readonly left: TabletopSeatPositionValue;
}

const fallbackSeatPosition: TabletopSeatPosition = { top: '82%', left: '50%' };

const seatPositions: Readonly<Record<TabletopSeatCount, readonly TabletopSeatPosition[]>> = {
  2: [fallbackSeatPosition, { top: '18%', left: '50%' }],
  3: [fallbackSeatPosition, { top: '28%', left: '18%' }, { top: '28%', left: '82%' }],
  4: [
    fallbackSeatPosition,
    { top: '50%', left: '12%' },
    { top: '18%', left: '50%' },
    { top: '50%', left: '88%' },
  ],
  5: [
    { top: '84%', left: '50%' },
    { top: '62%', left: '12%' },
    { top: '18%', left: '24%' },
    { top: '18%', left: '76%' },
    { top: '62%', left: '88%' },
  ],
  6: [
    { top: '84%', left: '50%' },
    { top: '68%', left: '16%' },
    { top: '26%', left: '16%' },
    { top: '16%', left: '50%' },
    { top: '26%', left: '84%' },
    { top: '68%', left: '84%' },
  ],
  7: [
    { top: '86%', left: '50%' },
    { top: '70%', left: '14%' },
    { top: '34%', left: '10%' },
    { top: '14%', left: '34%' },
    { top: '14%', left: '66%' },
    { top: '34%', left: '90%' },
    { top: '70%', left: '86%' },
  ],
  8: [
    { top: '86%', left: '50%' },
    { top: '72%', left: '16%' },
    { top: '50%', left: '8%' },
    { top: '20%', left: '20%' },
    { top: '14%', left: '50%' },
    { top: '20%', left: '80%' },
    { top: '50%', left: '92%' },
    { top: '72%', left: '84%' },
  ],
  9: [
    { top: '88%', left: '50%' },
    { top: '78%', left: '12%' },
    { top: '50%', left: '4%' },
    { top: '18%', left: '10%' },
    { top: '8%', left: '28%' },
    { top: '8%', left: '50%' },
    { top: '8%', left: '72%' },
    { top: '18%', left: '90%' },
    { top: '50%', left: '96%' },
  ],
  10: [
    { top: '88%', left: '50%' },
    { top: '80%', left: '20%' },
    { top: '58%', left: '6%' },
    { top: '30%', left: '8%' },
    { top: '10%', left: '30%' },
    { top: '8%', left: '50%' },
    { top: '10%', left: '70%' },
    { top: '30%', left: '92%' },
    { top: '58%', left: '94%' },
    { top: '80%', left: '80%' },
  ],
};

/*** Clamps the requested tabletop seat count to a supported ring. */
function normalizeTabletopSeatCount(count: number): TabletopSeatCount {
  const rounded = Math.round(count);
  if (rounded <= 2) return 2;
  if (rounded >= 10) return 10;

  return rounded as TabletopSeatCount;
}

/*** Returns the canonical seat positions for a ring size. */
function getTabletopSeatPositions(count: number): readonly TabletopSeatPosition[] {
  return seatPositions[normalizeTabletopSeatCount(count)];
}

/*** Returns a seat's canonical position with the hero at the bottom. */
export function getTabletopSeatPosition(index: number, count: number): TabletopSeatPosition {
  const positions = getTabletopSeatPositions(count);
  const position = positions[index % positions.length];

  return position ?? fallbackSeatPosition;
}
