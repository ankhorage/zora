import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { getContrastRatio, parseHexColorOrThrow } from '@ankhorage/color-theory';
import type { SurfaceTheme, ThemeMode } from '@ankhorage/surface';
import { expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { AppHeader as AppHeaderComponent } from './features/app-header/public';
import type { Breadcrumbs as BreadcrumbsComponent } from './features/breadcrumbs/public';
import type {
  Button as ButtonComponent,
  IconButton as IconButtonComponent,
} from './features/button/public';
import type { GameField as GameFieldComponent } from './features/game/public';
import type { View as ViewComponent } from './features/layout/public';
import type { useZoraTheme as useZoraThemeHook } from './features/theme/composition/useZoraTheme';
import type { ZoraProvider as ZoraProviderComponent } from './features/theme/runtime';
import type { Text as TextComponent } from './features/typography/public';

const webDist = join(import.meta.dir, '..', 'web-dist');

test('web materialization exposes the public AppHeader component', async () => {
  const manifest = (await Bun.file(join(webDist, 'manifest.json')).json()) as {
    artifacts: readonly { component: string; exportName: string; files: readonly string[] }[];
  };
  const appHeader = manifest.artifacts.find((entry) => entry.component === 'app-header');
  expect(appHeader?.exportName).toBe('AppHeader');
  expect(appHeader?.files).toContain('components/app-header/index.js');
  expect(appHeader?.files).toContain('components/app-header/AppHeader.d.ts');
});

test.each(['light', 'dark'] as const)(
  '%s mode composes inherited inversion, reset, and AppHeader without changing mode',
  async (mode) => {
    const { ZoraProvider, useZoraTheme } = (await import(
      pathToFileURL(join(webDist, 'runtime/ZoraProvider.js')).href
    )) as { ZoraProvider: typeof ZoraProviderComponent; useZoraTheme: typeof useZoraThemeHook };
    const { View } = (await import(
      pathToFileURL(join(webDist, 'components/view/index.js')).href
    )) as {
      View: typeof ViewComponent;
    };
    const { Text } = (await import(
      pathToFileURL(join(webDist, 'components/text/index.js')).href
    )) as {
      Text: typeof TextComponent;
    };
    const { Breadcrumbs } = (await import(
      pathToFileURL(join(webDist, 'components/breadcrumbs/index.js')).href
    )) as { Breadcrumbs: typeof BreadcrumbsComponent };
    const { Button } = (await import(
      pathToFileURL(join(webDist, 'components/button/index.js')).href
    )) as { Button: typeof ButtonComponent };
    const { IconButton } = (await import(
      pathToFileURL(join(webDist, 'components/icon-button/index.js')).href
    )) as { IconButton: typeof IconButtonComponent };
    const { GameField } = (await import(
      pathToFileURL(join(webDist, 'components/game-field/index.js')).href
    )) as { GameField: typeof GameFieldComponent };
    const { AppHeader } = (await import(
      pathToFileURL(join(webDist, 'components/app-header/index.js')).href
    )) as { AppHeader: typeof AppHeaderComponent };
    const observed = new Map<
      string,
      { mode: ThemeMode; inverted: boolean | undefined; theme: SurfaceTheme }
    >();

    function Probe({ id }: { id: string }) {
      const { mode: activeMode, inverted, theme } = useZoraTheme();
      observed.set(id, { mode: activeMode, inverted, theme });
      return <span data-probe={id} />;
    }

    const markup = renderToStaticMarkup(
      <ZoraProvider initialMode={mode}>
        <Probe id="root" />
        <View inverted>
          <Probe id="outer" />
          <Text>Inherited text</Text>
          <Breadcrumbs items={[{ id: 'home', label: 'Home', icon: { name: 'home-outline' } }]} />
          <IconButton iconName="add-outline" label="Add" variant="ghost" />
          <Button color="primary" variant="solid">
            Save
          </Button>
          <GameField inverted={false}>
            <Probe id="gameReset" />
          </GameField>
          <View inverted={false}>
            <Probe id="reset" />
            <Text>Reset text</Text>
            <IconButton iconName="close-outline" label="Reset action" variant="ghost" />
            <View inverted>
              <Probe id="reinverted" />
            </View>
          </View>
        </View>
        <AppHeader
          inverted
          title="Workspace"
          actions={
            <>
              <IconButton iconName="add-outline" label="Header action" variant="ghost" />
              <Button color="primary" variant="solid">
                Header save
              </Button>
            </>
          }
        >
          <Probe id="header" />
          <Breadcrumbs
            items={[{ id: 'header-home', label: 'Header home', icon: { name: 'home-outline' } }]}
          />
          <IconButton
            inverted={false}
            iconName="close-outline"
            label="Header reset"
            variant="ghost"
          />
        </AppHeader>
        <AppHeader>
          <Probe id="normalHeader" />
        </AppHeader>
        <AppHeader title="Workspace title" />
      </ZoraProvider>,
    );

    expect([...observed.keys()].sort()).toEqual([
      'gameReset',
      'header',
      'normalHeader',
      'outer',
      'reinverted',
      'reset',
      'root',
    ]);
    expect([...observed.values()].every((entry) => entry.mode === mode)).toBe(true);
    expect(observed.get('root')?.inverted).toBe(false);
    expect(observed.get('outer')?.inverted).toBe(true);
    expect(observed.get('reset')?.inverted).toBe(false);
    expect(observed.get('gameReset')?.inverted).toBe(false);
    expect(observed.get('reinverted')?.inverted).toBe(true);
    expect(observed.get('header')?.inverted).toBe(true);
    expect(observed.get('normalHeader')?.inverted).toBe(false);
    expect(observed.get('outer')?.theme.semantics.surface.default).toBe(
      observed.get('header')?.theme.semantics.surface.default,
    );
    expect(observed.get('reset')?.theme.semantics.surface.default).toBe(
      observed.get('root')?.theme.semantics.surface.default,
    );
    expect(observed.get('outer')?.theme.semantics.surface.default).not.toBe(
      observed.get('root')?.theme.semantics.surface.default,
    );
    const theme = observed.get('outer')?.theme;
    expect(theme).toBeDefined();
    if (theme === undefined) return;
    expect(
      getContrastRatio(
        parseHexColorOrThrow(theme.semantics.content.muted),
        parseHexColorOrThrow(theme.semantics.surface.default),
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(theme.semantics.action.primary.onSolidText).toBe(
      observed.get('root')?.theme.semantics.action.primary.onSolidText,
    );
    expect(markup).toContain('Inherited text');
    expect(markup).toContain('Reset text');
    expect(markup).toContain('Home');
    expect(markup).toContain('Save');
    expect(markup).toContain('Workspace title');
    expect(markup).toContain('Header home');
    expect(markup).toContain('Header save');
    expect(markup).toContain('data-probe="header"');
    expect(markup).not.toContain('inverted=');
  },
);
