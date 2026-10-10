import { Text, TimeGrid, View } from '@ankhorage/zora';
import React from 'react';

const tracks = Array.from({ length: 120 }, (_, index) => ({
  height: index % 9 === 0 ? 44 : 28,
  id: `track-${index}`,
}));

const clips = tracks.flatMap((track, trackIndex) =>
  Array.from({ length: 5 }, (_, clipIndex) => ({
    extent: 240,
    id: `${track.id}-clip-${clipIndex}`,
    laneId: track.id,
    start: clipIndex * 360 + (trackIndex % 7) * 24,
  })),
);

/*** Demonstrates a 120-track PPQ arranger with fixed 1/16 snapping independent of ruler density. */
export function DawArrangerScenario() {
  const [selectedIds, setSelectedIds] = React.useState<readonly string[]>([]);

  return (
    <TimeGrid
      contentWidth={2_400}
      height={420}
      intervals={clips}
      lanes={tracks}
      renderInterval={(interval, selected) => (
        <View
          style={{
            backgroundColor: selected ? '#1d4ed8' : '#2563eb',
            borderRadius: 3,
            flex: 1,
            paddingHorizontal: 6,
          }}
        >
          <Text color="inverted">{interval.id}</Text>
        </View>
      )}
      renderLaneLabel={(lane) => <Text>{lane.id}</Text>}
      selectedIntervalIds={selectedIds}
      width={720}
      onIntervalPress={(interval) => setSelectedIds([interval.id])}
    />
  );
}
