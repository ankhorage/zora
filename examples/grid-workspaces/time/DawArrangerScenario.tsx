import { ScreenSection, Text, TimeGrid, View } from '@ankhorage/zora';
import React from 'react';

import {
  PPQ,
  resolveDawBarStartPpq,
  secondsToPpqTicks,
  SIXTEENTH_NOTE_TICKS,
  snapDawPpqTick,
} from './timeGridDemoAdapters';

const RULER_BEAT_DENSITY = 2;

const arrangerLanes = Array.from({ length: 120 }, (_, index) => ({
  height: index % 9 === 0 ? 44 : 28,
  id: `track-${index + 1}`,
}));

const arrangerClips = arrangerLanes.flatMap((lane, laneIndex) =>
  Array.from({ length: 5 }, (_, clipIndex) => ({
    extent: PPQ * (clipIndex % 3 === 0 ? 3 : 2),
    id: `${lane.id}-clip-${clipIndex + 1}`,
    laneId: lane.id,
    start: snapDawPpqTick(
      resolveDawBarStartPpq(clipIndex) +
        (laneIndex % 7) * SIXTEENTH_NOTE_TICKS +
        (laneIndex % 3 === 0 ? secondsToPpqTicks(0.25, 120) : 0),
    ),
  })),
);

/*** Demonstrates 120 variable-height DAW tracks with PPQ clips and fixed 1/16 snapping. */
export function DawArrangerScenario() {
  const [selectedIds, setSelectedIds] = React.useState<readonly string[]>([]);

  return (
    <ScreenSection
      title="DAW arranger"
      description="4/4 transitions to 7/8; beat, triplet, and bar rulers remain presentation-only."
    >
      <Text>
        {`PPQ ${PPQ}; snap ${SIXTEENTH_NOTE_TICKS} ticks (1/16); ruler density ${RULER_BEAT_DENSITY} beats.`}
      </Text>
      <Text>
        The fixed snap resolution does not change when the ruler hides beats, triplets, or bars.
      </Text>
      <TimeGrid
        contentWidth={resolveDawBarStartPpq(12)}
        height={420}
        intervals={arrangerClips}
        lanes={arrangerLanes}
        renderInterval={(interval, selected) => (
          <View
            style={{
              backgroundColor: selected ? '#1d4ed8' : '#2563eb',
              borderRadius: 3,
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 6,
            }}
          >
            <Text>{interval.id}</Text>
          </View>
        )}
        renderLaneLabel={(lane) => <Text>{lane.id}</Text>}
        selectedIntervalIds={selectedIds}
        width={720}
        onIntervalPress={(interval) => setSelectedIds([interval.id])}
      />
    </ScreenSection>
  );
}
