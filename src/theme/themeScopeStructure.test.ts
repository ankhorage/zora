/**
 * Replace themeScopeStructure.test.ts with real behavior tests once the ZORA component test strategy is decided.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const themeDir = import.meta.dir;
const srcDir = join(themeDir, '..');

function readSource(...segments: readonly string[]) {
  return readFileSync(join(themeDir, ...segments), 'utf8');
}

function collectSourceFiles(rootDir: string) {
  const files: string[] = [];

  function visit(current: string) {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        visit(full);
        continue;
      }

      if (full.endsWith('.test.ts') || full.endsWith('.test.tsx')) {
        continue;
      }

      if (full.endsWith('.ts') || full.endsWith('.tsx')) {
        files.push(full);
      }
    }
  }

  visit(rootDir);
  return files;
}

const zoraProviderSource = readSource('ZoraProvider.tsx');
const themeScopeSource = readSource('ZoraThemeScope.tsx');
const hocSource = readSource('withZoraThemeScope.tsx');

const scopeGuardDirs = [
  join(srcDir, 'components'),
  join(srcDir, 'patterns'),
  join(srcDir, 'layout'),
  join(srcDir, 'foundation'),
] as const;

const scopeGuardFiles = scopeGuardDirs.flatMap(collectSourceFiles);

const scopedComponentFiles = [
  join(srcDir, 'components', 'badge', 'Badge.tsx'),
  join(srcDir, 'components', 'button', 'Button.tsx'),
  join(srcDir, 'components', 'card', 'Card.tsx'),
  join(srcDir, 'components', 'checkbox', 'Checkbox.tsx'),
  join(srcDir, 'components', 'checkbox', 'CheckboxGroup.tsx'),
  join(srcDir, 'components', 'drawer', 'Drawer.tsx'),
  join(srcDir, 'components', 'form', 'Form.tsx'),
  join(srcDir, 'components', 'form', 'FormActions.tsx'),
  join(srcDir, 'components', 'form', 'FormError.tsx'),
  join(srcDir, 'components', 'form', 'FormField.tsx'),
  join(srcDir, 'components', 'heading', 'Heading.tsx'),
  join(srcDir, 'components', 'icon', 'Icon.tsx'),
  join(srcDir, 'components', 'icon-button', 'IconButton.tsx'),
  join(srcDir, 'components', 'input', 'Input.tsx'),
  join(srcDir, 'components', 'modal', 'Modal.tsx'),
  join(srcDir, 'components', 'radio', 'Radio.tsx'),
  join(srcDir, 'components', 'radio', 'RadioGroup.tsx'),
  join(srcDir, 'components', 'select', 'Select.tsx'),
  join(srcDir, 'components', 'tabs', 'Tabs.tsx'),
  join(srcDir, 'components', 'text', 'Text.tsx'),
  join(srcDir, 'components', 'textarea', 'Textarea.tsx'),
  join(srcDir, 'components', 'toolbar', 'Toolbar.tsx'),
  join(srcDir, 'components', 'toolbar', 'ToolbarAction.tsx'),

  join(srcDir, 'layout', 'app-shell', 'AppShell.tsx'),
  join(srcDir, 'layout', 'auth-layout', 'AuthLayout.tsx'),
  join(srcDir, 'layout', 'page', 'Page.tsx'),
  join(srcDir, 'layout', 'page-header', 'PageHeader.tsx'),
  join(srcDir, 'layout', 'page-section', 'PageSection.tsx'),
  join(srcDir, 'layout', 'settings-layout', 'SettingsLayout.tsx'),
  join(srcDir, 'layout', 'sidebar-layout', 'SidebarLayout.tsx'),
  join(srcDir, 'layout', 'topbar-layout', 'TopbarLayout.tsx'),

  join(srcDir, 'patterns', 'auth', 'ForgotPasswordForm.tsx'),
  join(srcDir, 'patterns', 'auth', 'OtpForm.tsx'),
  join(srcDir, 'patterns', 'auth', 'SignInForm.tsx'),
  join(srcDir, 'patterns', 'auth', 'SignUpForm.tsx'),
  join(srcDir, 'patterns', 'collection-editor', 'CollectionEditor.tsx'),
  join(srcDir, 'patterns', 'confirm-dialog', 'ConfirmDialog.tsx'),
  join(srcDir, 'patterns', 'disclosure-section', 'DisclosureSection.tsx'),
  join(srcDir, 'patterns', 'empty-state', 'EmptyState.tsx'),
  join(srcDir, 'patterns', 'form-field', 'FormField.tsx'),
  join(srcDir, 'patterns', 'inspector-field', 'InspectorField.tsx'),
  join(srcDir, 'patterns', 'notice', 'Notice.tsx'),
  join(srcDir, 'patterns', 'panel', 'Panel.tsx'),
  join(srcDir, 'patterns', 'responsive-panel', 'ResponsivePanel.tsx'),
  join(srcDir, 'patterns', 'section-header', 'SectionHeader.tsx'),
  join(srcDir, 'patterns', 'settings-row', 'SettingsRow.tsx'),
  join(srcDir, 'patterns', 'switch-field', 'SwitchField.tsx'),
  join(srcDir, 'patterns', 'tile-grid', 'PaletteItem.tsx'),
  join(srcDir, 'patterns', 'tile-grid', 'TileGrid.tsx'),
  join(srcDir, 'patterns', 'tree-view', 'TreeItem.tsx'),
  join(srcDir, 'patterns', 'tree-view', 'TreeView.tsx'),

  join(srcDir, 'foundation', 'Box.tsx'),
  join(srcDir, 'foundation', 'Center.tsx'),
  join(srcDir, 'foundation', 'Container.tsx'),
  join(srcDir, 'foundation', 'Divider.tsx'),
  join(srcDir, 'foundation', 'Grid.tsx'),
  join(srcDir, 'foundation', 'Inline.tsx'),
  join(srcDir, 'foundation', 'Show.tsx'),
  join(srcDir, 'foundation', 'Spacer.tsx'),
  join(srcDir, 'foundation', 'Stack.tsx'),
  join(srcDir, 'foundation', 'Surface.tsx'),
] as const;

const scopedPropTypeFiles = [
  join(srcDir, 'components', 'badge', 'types.ts'),
  join(srcDir, 'components', 'button', 'types.ts'),
  join(srcDir, 'components', 'card', 'types.ts'),
  join(srcDir, 'components', 'checkbox', 'types.ts'),
  join(srcDir, 'components', 'drawer', 'types.ts'),
  join(srcDir, 'components', 'form', 'types.ts'),
  join(srcDir, 'components', 'heading', 'types.ts'),
  join(srcDir, 'components', 'icon', 'Icon.tsx'),
  join(srcDir, 'components', 'icon-button', 'types.ts'),
  join(srcDir, 'components', 'input', 'types.ts'),
  join(srcDir, 'components', 'modal', 'types.ts'),
  join(srcDir, 'components', 'radio', 'types.ts'),
  join(srcDir, 'components', 'select', 'types.ts'),
  join(srcDir, 'components', 'tabs', 'types.ts'),
  join(srcDir, 'components', 'text', 'types.ts'),
  join(srcDir, 'components', 'textarea', 'types.ts'),
  join(srcDir, 'components', 'toolbar', 'types.ts'),

  join(srcDir, 'layout', 'app-shell', 'types.ts'),
  join(srcDir, 'layout', 'auth-layout', 'types.ts'),
  join(srcDir, 'layout', 'page', 'types.ts'),
  join(srcDir, 'layout', 'page-header', 'types.ts'),
  join(srcDir, 'layout', 'page-section', 'types.ts'),
  join(srcDir, 'layout', 'settings-layout', 'types.ts'),
  join(srcDir, 'layout', 'sidebar-layout', 'types.ts'),
  join(srcDir, 'layout', 'topbar-layout', 'types.ts'),

  join(srcDir, 'patterns', 'auth', 'types.ts'),
  join(srcDir, 'patterns', 'collection-editor', 'types.ts'),
  join(srcDir, 'patterns', 'confirm-dialog', 'types.ts'),
  join(srcDir, 'patterns', 'disclosure-section', 'types.ts'),
  join(srcDir, 'patterns', 'empty-state', 'types.ts'),
  join(srcDir, 'patterns', 'form-field', 'types.ts'),
  join(srcDir, 'patterns', 'inspector-field', 'types.ts'),
  join(srcDir, 'patterns', 'notice', 'types.ts'),
  join(srcDir, 'patterns', 'panel', 'types.ts'),
  join(srcDir, 'patterns', 'responsive-panel', 'types.ts'),
  join(srcDir, 'patterns', 'section-header', 'types.ts'),
  join(srcDir, 'patterns', 'settings-row', 'types.ts'),
  join(srcDir, 'patterns', 'switch-field', 'types.ts'),
  join(srcDir, 'patterns', 'tile-grid', 'types.ts'),
  join(srcDir, 'patterns', 'tree-view', 'types.ts'),
] as const;

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

  it('adopts the inner + HOC pattern across the public surface', () => {
    for (const filePath of scopedComponentFiles) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).toMatch(/themeId: _themeId/);
      expect(source).toMatch(/mode: _mode/);
      expect(source).toMatch(/withZoraThemeScope/);
    }
  });

  it('adds ZoraBaseProps to public component prop types', () => {
    for (const filePath of scopedPropTypeFiles) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).toMatch(/ZoraBaseProps/);
      expect(source).toMatch(/extends\s+ZoraBaseProps/);
    }
  });

  it('does not implement theme scoping outside the theme module', () => {
    for (const filePath of scopeGuardFiles) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).not.toMatch(/ThemeContext\.Provider/);
      expect(source).not.toMatch(/ThemeProvider/);
      expect(source).not.toMatch(/<ZoraThemeScope/);
      expect(source).not.toMatch(/createTheme\(/);
    }
  });

  it('does not introduce a hook override API', () => {
    const srcFiles = collectSourceFiles(srcDir);
    for (const filePath of srcFiles) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).not.toMatch(/useZoraTheme\(\s*\{/);
    }
  });
});
