import { ScreenSection, Text, TimeGrid, View } from '@ankhorage/zora';

import {
  calendarDayMinuteToWorld,
  createCalendarAxis,
  resolveCalendarAxisWidth,
} from './timeGridDemoAdapters';

const HOUR = 60;

const calendarDays = createCalendarAxis(
  '2026-03-28',
  '2026-10-26',
  new Map([
    ['2026-03-29', 23 * HOUR],
    ['2026-10-25', 25 * HOUR],
  ]),
);

const ganttLanes = [
  { height: 40, id: 'design' },
  { height: 52, id: 'engineering' },
  { height: 40, id: 'release' },
] as const;

const ganttIntervals = [
  {
    extent: 12 * HOUR,
    id: 'research',
    laneId: 'design',
    start: calendarDayMinuteToWorld(calendarDays, '2026-03-28', 8 * HOUR),
  },
  {
    extent: 18 * HOUR,
    id: 'implementation',
    laneId: 'engineering',
    start: calendarDayMinuteToWorld(calendarDays, '2026-03-29', 4 * HOUR),
  },
  {
    extent: 10 * HOUR,
    id: 'launch',
    laneId: 'release',
    start: calendarDayMinuteToWorld(calendarDays, '2026-10-25', 9 * HOUR),
  },
] as const;

/*** Demonstrates external nonuniform-day and DST adaptation for a generic Gantt interval lane. */
export function SchedulerGanttScenario() {
  const contentWidth = resolveCalendarAxisWidth(calendarDays);

  return (
    <ScreenSection
      title="Scheduler / Gantt"
      description="Calendar and DST semantics are mapped into numeric world units before TimeGrid."
    >
      <Text>
        Every local day from March to October is mapped to world minutes. 2026-03-29 is 23 hours and
        2026-10-25 is 25 hours; TimeGrid receives only mapped world coordinates.
      </Text>
      <TimeGrid
        contentWidth={contentWidth}
        height={180}
        intervals={ganttIntervals}
        lanes={ganttLanes}
        renderInterval={(interval) => (
          <View
            style={{
              backgroundColor: '#0f766e',
              borderRadius: 4,
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 6,
            }}
          >
            <Text>{interval.id}</Text>
          </View>
        )}
        renderLaneLabel={(lane) => <Text>{lane.id}</Text>}
        width={600}
      />
    </ScreenSection>
  );
}
