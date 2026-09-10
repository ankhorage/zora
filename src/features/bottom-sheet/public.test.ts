import { describe, expect, test } from 'bun:test';

describe('ZORA BottomSheet public contract', () => {
  test('publishes an explicit ZORA subpath backed by Surface', async () => {
    const packageJson = (await Bun.file('package.json').json()) as {
      dependencies: Readonly<Record<string, string>>;
      exports: Readonly<Record<string, unknown>>;
      peerDependencies: Readonly<Record<string, string>>;
    };
    const source = await Bun.file('src/features/bottom-sheet/public.ts').text();

    expect(packageJson.exports['./bottom-sheet']).toBeDefined();
    expect(packageJson.dependencies['@ankhorage/surface']).toMatch(/^\^4\./u);
    expect(source).toContain("from '@ankhorage/surface/bottom-sheet'");
    for (const peer of [
      'react-native-gesture-handler',
      'react-native-reanimated',
      'react-native-worklets',
    ]) {
      expect(packageJson.peerDependencies[peer]).toBeDefined();
    }
  });

  test('installs the shared provider and removes picker ActionSheet dependencies', async () => {
    const [provider, datePicker, timePicker] = await Promise.all([
      Bun.file('src/theme/ZoraProvider.tsx').text(),
      Bun.file('src/components/date-picker/DatePicker.tsx').text(),
      Bun.file('src/components/time-picker/TimePicker.tsx').text(),
    ]);

    expect(provider).toContain('<BottomSheetProvider>{children}</BottomSheetProvider>');
    expect(datePicker).toContain('useBottomSheet()');
    expect(timePicker).toContain('useBottomSheet()');
    expect(datePicker).not.toContain("from '../action-sheet'");
    expect(timePicker).not.toContain("from '../action-sheet'");
  });
});
