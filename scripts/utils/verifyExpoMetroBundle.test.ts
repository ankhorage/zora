import { expect, test } from 'bun:test';

import { createExpoNativeBundleUrl, isExpoNativeBundleUrl } from './verifyExpoMetroBundle';

test('creates Expo 57 virtual bundle requests for each native platform', () => {
  const android = createExpoNativeBundleUrl(8081, 'android');
  const ios = createExpoNativeBundleUrl(8081, 'ios');

  expect(android.toString()).toBe(
    'http://127.0.0.1:8081/.expo/.virtual-metro-entry.bundle?platform=android&dev=true&minify=false&modulesOnly=false&runModule=true',
  );
  expect(ios.toString()).toBe(
    'http://127.0.0.1:8081/.expo/.virtual-metro-entry.bundle?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true',
  );
  expect(isExpoNativeBundleUrl(android, 'android')).toBeTrue();
  expect(isExpoNativeBundleUrl(ios, 'ios')).toBeTrue();
});

test('rejects literal and incomplete Metro entry URLs', () => {
  expect(
    isExpoNativeBundleUrl(
      new URL('http://127.0.0.1:8081/index.bundle?platform=ios&dev=true&minify=false'),
      'ios',
    ),
  ).toBeFalse();
  expect(
    isExpoNativeBundleUrl(
      new URL(
        'http://127.0.0.1:8081/.expo/.virtual-metro-entry.bundle?platform=ios&dev=true&minify=false',
      ),
      'ios',
    ),
  ).toBeFalse();
});
