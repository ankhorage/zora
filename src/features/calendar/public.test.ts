import { expect, test } from 'bun:test';

import { calendarMeta } from './calendarMeta';

test('Calendar publishes one locked GridView month presentation for both densities', async () => {
  const source = await Bun.file('src/features/calendar/adapters/inbound/Calendar.tsx').text();

  expect(calendarMeta.directManifestNode).toBe(false);
  expect(calendarMeta.description).toContain('GridView');
  expect(source).toContain('<GridView');
  expect(source).toContain('viewportInteraction="locked"');
  expect(source).toContain("density === 'compact' ? 42 : 48");
  expect(source).toContain('onSelectedDateChange?.(cell.date)');
});
