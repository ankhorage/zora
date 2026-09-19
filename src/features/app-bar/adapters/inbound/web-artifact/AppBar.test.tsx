import { expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { AppBar } from './AppBar';

test('renders a standalone web AppBar without an external responsive provider', () => {
  const markup = renderToStaticMarkup(
    <AppBar mode="light" safeAreaTop={false}>
      Packages
    </AppBar>,
  );

  expect(markup).toContain('Packages');
});
