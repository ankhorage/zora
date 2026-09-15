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
    expect(packageJson.dependencies['@ankhorage/surface']).toMatch(/^\^\d+\.\d+\.\d+$/u);
    expect(source).toContain("from '@ankhorage/surface/bottom-sheet'");
    for (const name of [
      'BottomSheetFlatList',
      'BottomSheetScrollView',
      'BottomSheetSectionList',
      'BottomSheetView',
      'BottomSheetVirtualizedList',
    ]) {
      expect(source).toContain(name);
    }
    const {
      'react-native-gesture-handler': gestureHandlerPeer,
      'react-native-reanimated': reanimatedPeer,
      'react-native-worklets': workletsPeer,
    } = packageJson.peerDependencies;
    expect(gestureHandlerPeer).toBeDefined();
    expect(reanimatedPeer).toBeDefined();
    expect(workletsPeer).toBeDefined();
  });

  test('installs BottomSheet only in the enabled native runtime capability host', async () => {
    const [provider, nativeCapabilities, webCapabilities, nativeDatePicker, nativeTimePicker] =
      await Promise.all([
        Bun.file('src/features/theme/adapters/inbound/ZoraProvider.tsx').text(),
        Bun.file('src/features/theme/composition/ZoraRuntimeCapabilities.native.tsx').text(),
        Bun.file('src/features/theme/composition/ZoraRuntimeCapabilities.web.tsx').text(),
        Bun.file('src/features/date-picker/adapters/inbound/DatePicker.native.tsx').text(),
        Bun.file('src/features/time-picker/adapters/inbound/TimePicker.native.tsx').text(),
      ]);

    expect(provider).toContain('<ZoraRuntimeCapabilities');
    expect(provider).not.toContain('BottomSheetProvider');
    expect(nativeCapabilities).toContain('<BottomSheetProvider>');
    expect(webCapabilities).not.toContain('BottomSheetProvider');
    expect(nativeDatePicker).toContain('useBottomSheet()');
    expect(nativeTimePicker).toContain('useBottomSheet()');
  });
});
