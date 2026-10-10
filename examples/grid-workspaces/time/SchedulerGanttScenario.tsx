import { Text, TimeGrid, View } from '@ankhorage/zora';
import React from 'react';

const resources = [
  { height: 40, id: 'design' },
  { height: 52, id: 'engineering' },
  { height: 40, id: 'release' },
];

// The host calendar adapter maps local days, DST boundaries, and holidays to numeric world units.
const schedule = [
  { extent: 40, id: 'research', laneId: 'design', start: 8 },
  { extent: 56, id: 'implementation', laneId: 'engineering', start: 40 },
  { extent: 32, id: 'launch', laneId: 'release', start: 112 },
];

/*** Demonstrates a Gantt schedule whose nonuniform calendar axis is adapted outside TimeGrid. */
export function SchedulerGanttScenario() {
  return (
    <TimeGrid
      contentWidth={180}
      height={180}
      intervals={schedule}
      lanes={resources}
      renderInterval={(interval) => (
        <View
          style={{ backgroundColor: '#0f766e', borderRadius: 4, flex: 1, paddingHorizontal: 6 }}
        >
          <Text color="inverted">{interval.id}</Text>
        </View>
      )}
      renderLaneLabel={(lane) => <Text>{lane.id}</Text>}
      width={600}
    />
  );
}
