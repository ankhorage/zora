import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const themeDir = import.meta.dir;

const zoraProviderSource = readFileSync(join(themeDir, 'ZoraProvider.tsx'), 'utf8');
const themeScopeSource = readFileSync(join(themeDir, 'ZoraThemeScope.tsx'), 'utf8');
const hocSource = readFileSync(join(themeDir, 'withZoraThemeScope.tsx'), 'utf8');

const textSource = readFileSync(join(themeDir, '..', 'components', 'text', 'Text.tsx'), 'utf8');
const headingSource = readFileSync(
  join(themeDir, '..', 'components', 'heading', 'Heading.tsx'),
  'utf8',
);
const buttonSource = readFileSync(
  join(themeDir, '..', 'components', 'button', 'Button.tsx'),
  'utf8',
);
const iconSource = readFileSync(join(themeDir, '..', 'components', 'icon', 'Icon.tsx'), 'utf8');
const iconButtonSource = readFileSync(
  join(themeDir, '..', 'components', 'icon-button', 'IconButton.tsx'),
  'utf8',
);
const cardSource = readFileSync(join(themeDir, '..', 'components', 'card', 'Card.tsx'), 'utf8');

const textTypesSource = readFileSync(
  join(themeDir, '..', 'components', 'text', 'types.ts'),
  'utf8',
);
const headingTypesSource = readFileSync(
  join(themeDir, '..', 'components', 'heading', 'types.ts'),
  'utf8',
);
const panelTypesSource = readFileSync(
  join(themeDir, '..', 'patterns', 'panel', 'types.ts'),
  'utf8',
);

describe('theme scope structure', () => {
  it('keeps ZoraProvider lightweight (no extra ResponsiveProvider nesting)', () => {
    expect(zoraProviderSource).toMatch(/ThemeProvider/);
    expect(zoraProviderSource).toMatch(/ZoraThemeRuntimeContext\.Provider/);
    expect(zoraProviderSource).not.toMatch(/ResponsiveProvider/);
  });

  it('implements nested scopes without nesting Surface ThemeProvider', () => {
    expect(themeScopeSource).toMatch(/ThemeContext\.Provider/);
    expect(themeScopeSource).toMatch(/createTheme\(/);
    expect(themeScopeSource).not.toMatch(/ThemeProvider/);
  });

  it('wraps components only when mode/themeId overrides are present', () => {
    expect(hocSource).toMatch(/props\.mode === undefined/);
    expect(hocSource).toMatch(/props\.themeId === undefined/);
    expect(hocSource).toMatch(/<ZoraThemeScope/);
  });

  it('adopts the inner + HOC pattern for the first component set', () => {
    expect(textSource).toMatch(/themeId: _themeId/);
    expect(textSource).toMatch(/mode: _mode/);
    expect(textSource).toMatch(/export const Text = withZoraThemeScope/);

    expect(headingSource).toMatch(/themeId: _themeId/);
    expect(headingSource).toMatch(/mode: _mode/);
    expect(headingSource).toMatch(/export const Heading = withZoraThemeScope/);

    expect(buttonSource).toMatch(/themeId: _themeId/);
    expect(buttonSource).toMatch(/mode: _mode/);
    expect(buttonSource).toMatch(/export const Button = withZoraThemeScope/);

    expect(iconSource).toMatch(/themeId: _themeId/);
    expect(iconSource).toMatch(/mode: _mode/);
    expect(iconSource).toMatch(/export const Icon = withZoraThemeScope/);

    expect(iconButtonSource).toMatch(/themeId: _themeId/);
    expect(iconButtonSource).toMatch(/mode: _mode/);
    expect(iconButtonSource).toMatch(/export const IconButton = withZoraThemeScope/);

    expect(cardSource).toMatch(/themeId: _themeId/);
    expect(cardSource).toMatch(/mode: _mode/);
    expect(cardSource).toMatch(/export const Card = withZoraThemeScope/);
  });

  it('adds ZoraBaseProps to converted public prop types', () => {
    expect(textTypesSource).toMatch(/export interface TextProps extends ZoraBaseProps/);
    expect(headingTypesSource).toMatch(/export interface HeadingProps extends ZoraBaseProps/);
    expect(panelTypesSource).toMatch(/export interface PanelProps extends ZoraBaseProps/);
  });
});
