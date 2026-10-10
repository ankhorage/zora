import { ScreenSection, Text, TimeGrid, View } from '@ankhorage/zora';

const HOUR = 60;

const calendarDays = [
  { duration: 24 * HOUR, id: '2026-03-28' },
  { duration: 23 * HOUR, id: '2026-03-29' },
  { duration: 24 * HOUR, id: '2026-03-30' },
  { duration: 24 * HOUR, id: '2026-10-24' },
  { duration: 25 * HOUR, id: '2026-10-25' },
] as const;

const ganttLanes = [
  { height: 40, id: 'design' },
  { height: 52, id: 'engineering' },
  { height: 40, id: 'release' },
] as const;

/*** Converts an external calendar day and minute offset into the generic numeric TimeGrid world. */
function calendarDayMinuteToWorld(dayId: string, minute: number) {
  const precedingDays = calendarDays.slice(
    0,
    calendarDays.findIndex((day) => day.id === dayId),
  );
  return precedingDays.reduce((total, day) => total + day.duration, 0) + minute;
}

const ganttIntervals = [
  {
    extent: 12 * HOUR,
    id: 'research',
    laneId: 'design',
    start: calendarDayMinuteToWorld('2026-03-28', 8 * HOUR),
  },
  {
    extent: 18 * HOUR,
    id: 'implementation',
    laneId: 'engineering',
    start: calendarDayMinuteToWorld('2026-03-29', 4 * HOUR),
  },
  {
    extent: 10 * HOUR,
    id: 'launch',
    laneId: 'release',
    start: calendarDayMinuteToWorld('2026-10-25', 9 * HOUR),
  },
] as const;

/*** Demonstrates external nonuniform-day and DST adaptation for a generic Gantt interval lane. */
export function SchedulerGanttScenario() {
  const contentWidth = calendarDays.reduce((total, day) => total + day.duration, 0);

  return (
    <ScreenSection
      title="Scheduler / Gantt"
      description="Calendar and DST semantics are mapped into numeric world units before TimeGrid."
    >
      <Text>
        2026-03-29 is 23 hours and 2026-10-25 is 25 hours; TimeGrid receives only mapped world
        coordinates.
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
