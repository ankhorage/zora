/**
 * Keep structural guards for the public Surface boundary alongside ZoraThemeScope behavior tests.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const themeDir = import.meta.dir;
const srcDir = join(themeDir, '..', '..');

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

const zoraProviderSource = readSource('adapters', 'inbound', 'ZoraProvider.tsx');
const themeScopeSource = readSource('adapters', 'inbound', 'ZoraThemeScope.tsx');
const hocSource = readSource('adapters', 'inbound', 'withZoraThemeScope.tsx');

const scopeGuardDirs = [join(srcDir, 'features')] as const;
const themeFeatureDir = join(srcDir, 'features', 'theme');

const scopeGuardFiles = scopeGuardDirs
  .flatMap(collectSourceFiles)
  .filter((filePath) => !filePath.startsWith(`${themeFeatureDir}/`));

const scopedComponentFiles = [
  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'AppShell.tsx'),
  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'Screen.tsx'),
  join(srcDir, 'features', 'section', 'adapters', 'inbound', 'ScreenSection.tsx'),
  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'ScrollView.tsx'),
  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'View.tsx'),
  join(srcDir, 'features', 'content-rail', 'adapters', 'inbound', 'ContentRail.tsx'),
  join(srcDir, 'features', 'palette-item', 'adapters', 'inbound', 'PaletteItem.tsx'),
  join(srcDir, 'features', 'list', 'adapters', 'inbound', 'FlatList.tsx'),
  join(srcDir, 'features', 'list', 'adapters', 'inbound', 'SectionList.tsx'),
  join(srcDir, 'features', 'bottom-sheet', 'adapters', 'inbound', 'BottomSheet.tsx'),
  join(srcDir, 'features', 'app-bar', 'adapters', 'inbound', 'AppBar.tsx'),
  join(srcDir, 'features', 'accordion', 'adapters', 'inbound', 'Accordion.tsx'),
  join(srcDir, 'features', 'accordion', 'adapters', 'inbound', 'AccordionItem.tsx'),
  join(srcDir, 'features', 'badge', 'adapters', 'inbound', 'Badge.tsx'),
  join(srcDir, 'features', 'breadcrumbs', 'adapters', 'inbound', 'Breadcrumbs.tsx'),
  join(srcDir, 'features', 'button', 'adapters', 'inbound', 'Button.tsx'),
  join(srcDir, 'features', 'button', 'adapters', 'inbound', 'ButtonGroup.tsx'),
  join(srcDir, 'features', 'card', 'adapters', 'inbound', 'Card.tsx'),
  join(srcDir, 'features', 'card', 'adapters', 'inbound', 'MediaCard.tsx'),
  join(srcDir, 'features', 'card', 'adapters', 'inbound', 'MetricCard.tsx'),
  join(srcDir, 'features', 'date-picker', 'adapters', 'inbound', 'DatePicker.native.tsx'),
  join(srcDir, 'features', 'date-picker', 'adapters', 'inbound', 'DatePicker.web.tsx'),
  join(srcDir, 'features', 'dialog', 'adapters', 'inbound', 'Dialog.tsx'),
  join(srcDir, 'features', 'form', 'checkbox', 'adapters', 'inbound', 'Checkbox.tsx'),
  join(srcDir, 'features', 'form', 'checkbox', 'adapters', 'inbound', 'CheckboxGroup.tsx'),
  join(srcDir, 'features', 'form', 'adapters', 'inbound', 'Form.tsx'),
  join(srcDir, 'features', 'form', 'adapters', 'inbound', 'FormActions.tsx'),
  join(srcDir, 'features', 'form', 'adapters', 'inbound', 'FormError.tsx'),
  join(srcDir, 'features', 'form', 'field', 'adapters', 'inbound', 'Field.tsx'),
  join(srcDir, 'features', 'form', 'search-input', 'adapters', 'inbound', 'SearchInput.tsx'),
  join(srcDir, 'features', 'form', 'select', 'adapters', 'inbound', 'Select.native.tsx'),
  join(srcDir, 'features', 'form', 'select', 'adapters', 'inbound', 'Select.web.tsx'),
  join(srcDir, 'features', 'typography', 'adapters', 'inbound', 'Heading.tsx'),
  join(srcDir, 'features', 'icon', 'adapters', 'inbound', 'Icon.tsx'),
  join(srcDir, 'features', 'button', 'adapters', 'inbound', 'IconButton.tsx'),
  join(srcDir, 'features', 'form', 'text-input', 'adapters', 'inbound', 'TextInput.tsx'),
  join(srcDir, 'features', 'pagination', 'adapters', 'inbound', 'Pagination.tsx'),
  join(srcDir, 'features', 'popover-menu', 'adapters', 'inbound', 'PopoverMenu.tsx'),
  join(srcDir, 'features', 'progress', 'adapters', 'inbound', 'Progress.tsx'),
  join(srcDir, 'features', 'form', 'radio', 'adapters', 'inbound', 'Radio.tsx'),
  join(srcDir, 'features', 'form', 'radio', 'adapters', 'inbound', 'RadioGroup.tsx'),
  join(srcDir, 'features', 'rating', 'adapters', 'inbound', 'Rating.tsx'),
  join(srcDir, 'features', 'tabs', 'adapters', 'inbound', 'Tab.tsx'),
  join(srcDir, 'features', 'tabs', 'adapters', 'inbound', 'TabList.tsx'),
  join(srcDir, 'features', 'tabs', 'adapters', 'inbound', 'TabPanel.tsx'),
  join(srcDir, 'features', 'tabs', 'adapters', 'inbound', 'Tabs.tsx'),
  join(srcDir, 'features', 'time-picker', 'adapters', 'inbound', 'TimePicker.native.tsx'),
  join(srcDir, 'features', 'time-picker', 'adapters', 'inbound', 'TimePicker.web.tsx'),
  join(srcDir, 'features', 'toast', 'adapters', 'inbound', 'Toast.tsx'),
  join(srcDir, 'features', 'toolbar', 'adapters', 'inbound', 'Toolbar.tsx'),
  join(srcDir, 'features', 'typography', 'adapters', 'inbound', 'Text.tsx'),

  join(srcDir, 'features', 'auth', 'adapters', 'inbound', 'ForgotPasswordForm.tsx'),
  join(srcDir, 'features', 'auth', 'adapters', 'inbound', 'OtpForm.tsx'),
  join(srcDir, 'features', 'auth', 'adapters', 'inbound', 'SignInForm.tsx'),
  join(srcDir, 'features', 'auth', 'adapters', 'inbound', 'SignUpForm.tsx'),
  join(srcDir, 'features', 'gradient', 'adapters', 'inbound', 'Gradient.tsx'),
  join(srcDir, 'features', 'collection-editor', 'adapters', 'inbound', 'CollectionEditor.tsx'),
  join(srcDir, 'features', 'empty-state', 'adapters', 'inbound', 'EmptyState.tsx'),
  join(srcDir, 'features', 'list', 'adapters', 'inbound', 'List.tsx'),
  join(srcDir, 'features', 'list', 'adapters', 'inbound', 'ListItem.tsx'),
  join(srcDir, 'features', 'list', 'adapters', 'inbound', 'ListSection.tsx'),
  join(srcDir, 'features', 'section', 'adapters', 'inbound', 'SectionHeader.tsx'),
  join(srcDir, 'features', 'form', 'switch', 'adapters', 'inbound', 'Switch.tsx'),
  join(srcDir, 'features', 'timeline', 'adapters', 'inbound', 'Timeline.tsx'),
  join(srcDir, 'features', 'tree-view', 'adapters', 'inbound', 'TreeItem.tsx'),
  join(srcDir, 'features', 'tree-view', 'adapters', 'inbound', 'TreeView.tsx'),

  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'Divider.tsx'),
  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'Grid.tsx'),
  join(srcDir, 'features', 'surface', 'adapters', 'inbound', 'Surface.tsx'),
] as const;

const scopedPropTypeFiles = [
  join(srcDir, 'types', 'layout.ts'),
  join(srcDir, 'types', 'palette-item.ts'),
  join(srcDir, 'types', 'app-bar.ts'),
  join(srcDir, 'types', 'accordion.ts'),
  join(srcDir, 'types', 'badge.ts'),
  join(srcDir, 'types', 'breadcrumbs.ts'),
  join(srcDir, 'types', 'button.ts'),
  join(srcDir, 'types', 'button-group.ts'),
  join(srcDir, 'types', 'card.ts'),
  join(srcDir, 'types', 'media-card.ts'),
  join(srcDir, 'types', 'metric-card.ts'),
  join(srcDir, 'types', 'checkbox.ts'),
  join(srcDir, 'types', 'date-picker.ts'),
  join(srcDir, 'types', 'dialog.ts'),
  join(srcDir, 'types', 'form.ts'),
  join(srcDir, 'types', 'heading.ts'),
  join(srcDir, 'types', 'icon.ts'),
  join(srcDir, 'types', 'icon-button.ts'),
  join(srcDir, 'types', 'pagination.ts'),
  join(srcDir, 'types', 'popover-menu.ts'),
  join(srcDir, 'types', 'progress.ts'),
  join(srcDir, 'types', 'radio.ts'),
  join(srcDir, 'types', 'rating.ts'),
  join(srcDir, 'types', 'search-input.ts'),
  join(srcDir, 'types', 'select.ts'),
  join(srcDir, 'types', 'tabs.ts'),
  join(srcDir, 'types', 'text-input.ts'),
  join(srcDir, 'types', 'text.ts'),
  join(srcDir, 'types', 'time-picker.ts'),
  join(srcDir, 'types', 'toast.ts'),
  join(srcDir, 'types', 'toolbar.ts'),

  join(srcDir, 'types', 'auth.ts'),
  join(srcDir, 'types', 'gradient.ts'),
  join(srcDir, 'types', 'collection-editor.ts'),
  join(srcDir, 'types', 'empty-state.ts'),
  join(srcDir, 'types', 'list.ts'),
  join(srcDir, 'types', 'section.ts'),
  join(srcDir, 'types', 'switch.ts'),
  join(srcDir, 'types', 'timeline.ts'),
  join(srcDir, 'types', 'tree-view.ts'),
] as const;

describe('theme scope structure', () => {
  it('keeps ZoraProvider lightweight (no extra ResponsiveProvider nesting)', () => {
    expect(zoraProviderSource).toMatch(/ThemeProvider/);
    expect(zoraProviderSource).toMatch(/<ZoraThemeRuntimeContext\s+value=/u);
    expect(zoraProviderSource).not.toMatch(/ResponsiveProvider/);
  });

  it('delegates nested Surface runtime ownership to the public ThemeScope boundary', () => {
    expect(themeScopeSource).toMatch(/import \{ ThemeScope \} from '@ankhorage\/surface'/u);
    expect(themeScopeSource).toMatch(/<ThemeScope\s+mode=/u);
    expect(themeScopeSource).not.toMatch(/ThemeContext/u);
    expect(themeScopeSource).not.toMatch(/useFontContext/u);
    expect(themeScopeSource).not.toMatch(/createTheme\(/u);
    expect(themeScopeSource).not.toMatch(/_hasProvider/u);
    expect(themeScopeSource).not.toMatch(/<ThemeProvider\b/u);
  });

  it('wraps components only when mode/themeId overrides are present', () => {
    expect(hocSource).toMatch(/props\.mode === undefined/u);
    expect(hocSource).toMatch(/props\.themeId === undefined/u);
    expect(hocSource).toMatch(/<ZoraThemeScope/u);
  });

  it('adopts the inner + HOC pattern across the public surface', () => {
    for (const filePath of scopedComponentFiles) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).toMatch(/themeId: _themeId/u);
      expect(source).toMatch(/mode: _mode/u);
      expect(source).toMatch(/withZoraThemeScope/u);
    }
  });

  it('adds ZoraBaseProps to public component prop types', () => {
    for (const filePath of scopedPropTypeFiles) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).toMatch(/ZoraBaseProps/u);
      expect(source).toMatch(/extends\s+ZoraBaseProps|ZoraBaseProps\s*&|&\s*ZoraBaseProps/u);
    }
  });

  it('does not implement theme scoping outside the theme module', () => {
    for (const filePath of scopeGuardFiles) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).not.toMatch(/<ThemeContext(?:\.Provider)?\b/u);
      expect(source).not.toMatch(/ThemeProvider/u);
      expect(source).not.toMatch(/<ZoraThemeScope/u);
      expect(source).not.toMatch(/createTheme\(/u);
    }
  });

  it('does not introduce a hook override API', () => {
    const srcFiles = collectSourceFiles(srcDir);
    for (const filePath of srcFiles) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).not.toMatch(/useZoraTheme\(\s*\{/u);
    }
  });
});
