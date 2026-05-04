import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const SHOWCASE_ROOT = join(process.cwd(), 'examples', 'expo-showcase');

const REQUIRED_SHOWCASE_COVERAGE = {
  components: [
    'Badge',
    'Button',
    'Card',
    'Checkbox',
    'CheckboxGroup',
    'Drawer',
    'Form',
    'FormActions',
    'FormError',
    'FormField',
    'Heading',
    'Icon',
    'IconButton',
    'Input',
    'Modal',
    'Radio',
    'RadioGroup',
    'Select',
    'Tabs',
    'Text',
    'Textarea',
    'Toolbar',
    'ToolbarAction',
  ],
  foundation: [
    'Box',
    'Center',
    'Container',
    'Divider',
    'Grid',
    'Inline',
    'Show',
    'Spacer',
    'Stack',
    'Surface',
  ],
  layouts: [
    'AppShell',
    'AuthLayout',
    'Page',
    'PageHeader',
    'PageSection',
    'SettingsLayout',
    'SidebarLayout',
    'TopbarLayout',
  ],
  patterns: [
    'ForgotPasswordForm',
    'OtpForm',
    'SignInForm',
    'SignUpForm',
    'CollectionEditor',
    'ConfirmDialog',
    'DisclosureSection',
    'EmptyState',
    'InspectorField',
    'Notice',
    'Panel',
    'ResponsivePanel',
    'SectionHeader',
    'SettingsRow',
    'SwitchField',
    'ThemeComposer',
    'PaletteItem',
    'TileGrid',
    'TreeItem',
    'TreeView',
  ],
} as const;

function listFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(root, entry.name);
    if (entry.isDirectory()) {
      return listFiles(absolutePath);
    }

    return entry.isFile() && /\.[cm]?tsx?$/.test(entry.name) ? [absolutePath] : [];
  });
}

function readShowcaseSource(): string {
  return listFiles(SHOWCASE_ROOT)
    .map((filePath) => readFileSync(filePath, 'utf8'))
    .join('\n');
}

describe('expo showcase coverage policy', () => {
  test('does not import Surface directly from the showcase app', () => {
    for (const filePath of listFiles(SHOWCASE_ROOT)) {
      const source = readFileSync(filePath, 'utf8');
      expect(source).not.toContain("from '@ankhorage/surface'");
      expect(source).not.toContain('from "@ankhorage/surface"');
    }
  });

  test('documents public ZORA API coverage in the showcase source', () => {
    const source = readShowcaseSource();
    const requiredNames = Object.values(REQUIRED_SHOWCASE_COVERAGE).flat();

    for (const requiredName of requiredNames) {
      expect(source).toContain(requiredName);
    }
  });
});
