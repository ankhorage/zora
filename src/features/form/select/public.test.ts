import { expect, test } from 'bun:test';

import { selectMeta } from './selectMeta';

test('Select is a direct manifest node with valueChange payload', () => {
  expect(selectMeta.directManifestNode).toBe(true);
  expect(selectMeta.events.valueChange.eventType).toBe('select.valueChange');
  expect(selectMeta.events.valueChange.payloadFields).toEqual([
    { path: 'value', type: 'string', label: 'Value' },
  ]);
});

test('Select uses web Popover and native BottomSheetFlatList presentation', async () => {
  const [neutral, web, native] = await Promise.all([
    Bun.file('src/features/form/select/adapters/inbound/Select.tsx').text(),
    Bun.file('src/features/form/select/adapters/inbound/Select.web.tsx').text(),
    Bun.file('src/features/form/select/adapters/inbound/Select.native.tsx').text(),
  ]);

  expect(neutral).toContain("export { Select } from './Select.web';");
  expect(web).toContain("import { Popover } from '@ankhorage/surface';");
  expect(native).toContain('<BottomSheetFlatList');
  expect(native).toContain("contentMode: 'direct'");
  expect(`${neutral}\n${web}\n${native}`).not.toContain('@react-native-picker/picker');
});

test('Select exposes and forwards a serializable leading SVG icon through the shared trigger', async () => {
  const [selectTypes, selectTrigger] = await Promise.all([
    Bun.file('src/types/select.ts').text(),
    Bun.file('src/features/form/select/composition/SelectTrigger.tsx').text(),
  ]);

  expect(selectTypes).toContain("import type { ButtonIconSpec } from '@ankhorage/surface';");
  expect(selectTypes).toContain('leadingIcon?: ButtonIconSpec;');
  expect(selectTrigger).toContain('leadingIcon={props.leadingIcon}');
});
