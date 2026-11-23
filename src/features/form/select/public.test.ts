import { expect, test } from 'bun:test';

import { selectMeta } from './selectMeta';

test('Select is a direct manifest node with valueChange payload', () => {
  expect(selectMeta.directManifestNode).toBe(true);
  expect(selectMeta.events.valueChange.eventType).toBe('select.valueChange');
  expect(selectMeta.events.valueChange.payloadFields).toEqual([
    { path: 'value', type: 'string', label: 'Value' },
  ]);
});

test('Select registers the optional leading icon as instance-owned media metadata', () => {
  expect(selectMeta.props.leadingIcon).toEqual({
    type: 'media',
    category: 'Content',
    label: 'Leading SVG icon',
    mediaKinds: ['image'],
    authoring: { authority: 'instance' },
  });
});

test('Select registers optional trigger label emphasis as serializable metadata', () => {
  expect(selectMeta.props.labelWeight).toEqual({
    type: 'string',
    category: 'Style',
    label: 'Label weight',
    enum: ['semiBold', 'bold'],
    default: 'semiBold',
    authoring: { authority: 'instance' },
  });
});

test('Select is exported through its public component entrypoint', async () => {
  const publicEntry = await Bun.file('src/features/form/select/public.ts').text();

  expect(publicEntry).toContain(
    "export type { SelectOption, SelectProps } from '../../../types/select';",
  );
  expect(publicEntry).toContain("export { Select } from './adapters/inbound/Select';");
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

test('Select trigger preserves semiBold by default and forwards bold SVG icon combinations', async () => {
  const [selectTypes, selectTrigger] = await Promise.all([
    Bun.file('src/types/select.ts').text(),
    Bun.file('src/features/form/select/composition/SelectTrigger.tsx').text(),
  ]);

  expect(selectTypes).toContain(
    "import type { ButtonIconSpec, ButtonLabelWeight } from '@ankhorage/surface';",
  );
  expect(selectTypes).toContain('leadingIcon?: ButtonIconSpec;');
  expect(selectTypes).toContain('labelWeight?: ButtonLabelWeight;');
  expect(selectTrigger).toContain("labelWeight={props.labelWeight ?? 'semiBold'}");
  expect(selectTrigger).toContain('leadingIcon={props.leadingIcon}');
  expect(selectMeta.props.labelWeight.enum).toEqual(['semiBold', 'bold']);
  expect(selectMeta.props.leadingIcon.mediaKinds).toEqual(['image']);
  expect(selectTrigger).not.toContain('<Text');
});
