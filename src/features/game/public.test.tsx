import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { ZoraProvider as ZoraProviderComponent } from '../theme/runtime';
import type { GameEntity as GameEntityComponent, GameField as GameFieldComponent } from './public';

const webDistRoot = join(import.meta.dir, '../../../web-dist');

test('generic web materialization renders Game field and entity without a plugin catalog', async () => {
  const manifest: unknown = await Bun.file(join(webDistRoot, 'manifest.json')).json();
  if (
    typeof manifest !== 'object' ||
    manifest === null ||
    !('artifacts' in manifest) ||
    !Array.isArray(manifest.artifacts)
  ) {
    throw new Error('Expected a generated web artifact catalog.');
  }
  const artifactNames = Object.values(manifest.artifacts as readonly unknown[])
    .filter(
      (artifact) => typeof artifact === 'object' && artifact !== null && 'exportName' in artifact,
    )
    .map((artifact) => artifact.exportName);
  const exports = new Set(artifactNames);
  for (const name of [
    'Game',
    'GameField',
    'GameEntity',
    'GameInputZone',
    'GameMeasurementProbe',
    'GameOverlay',
  ]) {
    expect(exports.has(name), name).toBe(true);
  }

  const { GameField } = (await import(
    pathToFileURL(join(webDistRoot, 'components/game-field/index.js')).href
  )) as { GameField: typeof GameFieldComponent };
  const { GameEntity } = (await import(
    pathToFileURL(join(webDistRoot, 'components/game-entity/index.js')).href
  )) as { GameEntity: typeof GameEntityComponent };
  const { ZoraProvider } = (await import(
    pathToFileURL(join(webDistRoot, 'runtime/ZoraProvider.js')).href
  )) as { ZoraProvider: typeof ZoraProviderComponent };
  const browser = new Window();
  browser.document.body.innerHTML = renderToStaticMarkup(
    <ZoraProvider mode="light">
      <GameField testID="field">
        <GameEntity x={25} y={40} testID="entity" />
      </GameField>
    </ZoraProvider>,
  );
  expect(browser.document.querySelector('[data-testid="field"]')).not.toBeNull();
  expect(browser.document.querySelector('[data-testid="field"]')?.getAttribute('style')).toContain(
    'min-height:320px',
  );
  expect(browser.document.querySelector('[data-testid="entity"]')).not.toBeNull();
  browser.close();
});
