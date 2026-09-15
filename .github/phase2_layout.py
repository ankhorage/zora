from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src'
EXAMPLES = ROOT / 'examples'
BRANCH_WORKFLOW = ROOT / '.github' / 'workflows' / 'phase2-layout.yml'
SELF = ROOT / '.github' / 'phase2_layout.py'


def read(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def remove_plain_view_from_react_native_imports() -> None:
    pattern = re.compile(r"import\s*\{(?P<body>.*?)\}\s*from\s*['\"]react-native['\"];", re.DOTALL)
    for path in SRC.rglob('*.tsx'):
        text = read(path)
        if "features/layout/public'" not in text or 'View' not in text:
            continue

        def replace(match: re.Match[str]) -> str:
            specs = [part.strip() for part in match.group('body').replace('\n', ' ').split(',') if part.strip()]
            if 'View' not in specs:
                return match.group(0)
            specs = [spec for spec in specs if spec != 'View']
            if not specs:
                return ''
            if len(specs) == 1:
                return f"import {{ {specs[0]} }} from 'react-native';"
            return "import {\n  " + ",\n  ".join(specs) + ",\n} from 'react-native';"

        next_text = pattern.sub(replace, text)
        if next_text != text:
            write(path, next_text)


def replace_removed_layout_prop_types() -> None:
    for base in (SRC, EXAMPLES):
        for path in base.rglob('*'):
            if path.suffix not in {'.ts', '.tsx'}:
                continue
            text = read(path)
            next_text = re.sub(r'\b(?:BoxProps|StackProps|ContainerProps)\b', 'ViewProps', text)
            if next_text != text:
                write(path, next_text)


def move_content_rail() -> None:
    source_feature = SRC / 'features' / 'layout'
    target_feature = SRC / 'features' / 'content-rail'
    target_inbound = target_feature / 'adapters' / 'inbound'
    target_inbound.mkdir(parents=True, exist_ok=True)

    content = read(source_feature / 'adapters' / 'inbound' / 'ContentRail.tsx')
    content = content.replace("import { Box, Stack, View } from '../../public';", "import { View } from '../../../layout/public';")
    content = re.sub(r'<(/?)(?:Box|Stack)\b', r'<\1View', content)
    write(target_inbound / 'ContentRail.tsx', content)

    for name in ['ContentRail.test.ts', 'ContentRailFlow.tsx']:
        shutil.move(source_feature / 'adapters' / 'inbound' / name, target_inbound / name)

    shutil.copytree(source_feature / 'utils', target_feature / 'utils', dirs_exist_ok=True)
    shutil.rmtree(source_feature / 'utils')

    meta = read(source_feature / 'contentRailMeta.ts')
    write(target_feature / 'contentRailMeta.ts', meta)
    (source_feature / 'contentRailMeta.ts').unlink()

    write(
        target_feature / 'constants.ts',
        "export const CONTENT_RAIL_SPACING_VALUES = ['none', 'xs', 's', 'm', 'l', 'xl'] as const;\n",
    )
    layout_constants = source_feature / 'constants.ts'
    text = read(layout_constants)
    text = re.sub(r"export const CONTENT_RAIL_SPACING_VALUES = .*?;\n\n", '', text, flags=re.DOTALL)
    write(layout_constants, text)

    write(
        target_feature / 'public.ts',
        """export type {\n  ContentRailControlPressEvent,\n  ContentRailDirection,\n  ContentRailItemSize,\n  ContentRailMotion,\n  ContentRailProps,\n  ContentRailSpacing,\n  ContentRailVisibleRangeChangeEvent,\n} from '../../types/content-rail';\nexport { ContentRail } from './adapters/inbound/ContentRail';\n""",
    )

    for name in ['ContentRail.tsx']:
        (source_feature / 'adapters' / 'inbound' / name).unlink(missing_ok=True)


def write_layout_semantics() -> None:
    types_path = SRC / 'types' / 'layout.ts'
    write(
        types_path,
        """import type {\n  DividerProps as SurfaceDividerProps,\n  GridProps as SurfaceGridProps,\n  ScrollViewProps as SurfaceScrollViewProps,\n  ViewProps as SurfaceViewProps,\n} from '@ankhorage/surface';\nimport type React from 'react';\n\nimport type { ZoraContentWidth } from '../internal/recipes';\nimport type { ZoraBaseProps } from '../theme/ZoraBaseProps';\n\nexport interface ViewProps extends ZoraBaseProps, Omit<SurfaceViewProps, 'mode' | 'themeId'> {}\nexport interface ScrollViewProps\n  extends ZoraBaseProps, Omit<SurfaceScrollViewProps, 'mode' | 'themeId'> {}\nexport interface DividerProps\n  extends ZoraBaseProps, Omit<SurfaceDividerProps, 'mode' | 'themeId'> {}\nexport interface GridProps extends ZoraBaseProps, Omit<SurfaceGridProps, 'mode' | 'themeId'> {}\n\nexport interface AppShellProps extends ZoraBaseProps {\n  children?: React.ReactNode;\n  header?: React.ReactNode;\n  footer?: React.ReactNode;\n  overlay?: React.ReactNode;\n}\n\nexport interface ScreenProps extends ZoraBaseProps {\n  children?: React.ReactNode;\n  footer?: React.ReactNode;\n  scroll?: boolean;\n  width?: ZoraContentWidth;\n}\n\nexport interface ScreenSectionProps extends ZoraBaseProps {\n  title?: React.ReactNode;\n  description?: React.ReactNode;\n  actions?: React.ReactNode;\n  children?: React.ReactNode;\n}\n""",
    )

    inbound = SRC / 'features' / 'layout' / 'adapters' / 'inbound'
    write(
        inbound / 'AppShell.tsx',
        """import React from 'react';\n\nimport { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';\nimport type { AppShellProps } from '../../../../types/layout';\nimport { View } from './View';\n\nfunction AppShellInner({\n  themeId: _themeId,\n  mode: _mode,\n  interactionPolicy: _interactionPolicy,\n  children,\n  header,\n  footer,\n  overlay,\n  testID,\n}: AppShellProps) {\n  return (\n    <View bg=\"background\" flex={1} testID={testID}>\n      <View flex={1} minHeight={0} position=\"relative\">\n        {header ? <View flexShrink={0}>{header}</View> : null}\n        <View flex={1} minHeight={0} minWidth={0}>\n          {children}\n        </View>\n        {footer ? <View flexShrink={0}>{footer}</View> : null}\n        {overlay ? (\n          <View\n            bottom={0}\n            left={0}\n            pointerEvents=\"box-none\"\n            position=\"absolute\"\n            right={0}\n            top={0}\n            zIndex={10}\n          >\n            {overlay}\n          </View>\n        ) : null}\n      </View>\n    </View>\n  );\n}\n\n/*** Root application frame with explicit header, content, footer, and overlay slots. */\nexport const AppShell = withZoraThemeScope(AppShellInner);\n""",
    )
    write(
        inbound / 'Screen.tsx',
        """import React from 'react';\n\nimport { resolvePageMaxWidth } from '../../../../internal/recipes';\nimport { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';\nimport type { ScreenProps } from '../../../../types/layout';\nimport { ScrollView } from './ScrollView';\nimport { View } from './View';\n\nfunction ScreenInner({\n  themeId: _themeId,\n  mode: _mode,\n  interactionPolicy: _interactionPolicy,\n  children,\n  footer,\n  scroll = true,\n  width = 'default',\n  testID,\n}: ScreenProps) {\n  const content = (\n    <View\n      alignSelf=\"center\"\n      gap=\"l\"\n      maxWidth={resolvePageMaxWidth(width)}\n      px={{ base: 16, md: 24, lg: 32 }}\n      py=\"xl\"\n      testID={testID}\n      width=\"100%\"\n    >\n      {children}\n      {footer}\n    </View>\n  );\n\n  if (!scroll) {\n    return (\n      <View bg=\"background\" flex={1} minHeight={0} minWidth={0}>\n        {content}\n      </View>\n    );\n  }\n\n  return (\n    <ScrollView bg=\"background\" flex={1} minHeight={0} minWidth={0}>\n      {content}\n    </ScrollView>\n  );\n}\n\n/*** Screen content boundary with independent width policy and scroll ownership. */\nexport const Screen = withZoraThemeScope(ScreenInner);\n""",
    )
    write(
        inbound / 'ScreenSection.tsx',
        """import React from 'react';\n\nimport { SectionHeader } from '../../../../patterns/section-header';\nimport { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';\nimport type { ScreenSectionProps } from '../../../../types/layout';\nimport { View } from './View';\n\nfunction ScreenSectionInner({\n  themeId: _themeId,\n  mode: _mode,\n  interactionPolicy: _interactionPolicy,\n  title,\n  description,\n  actions,\n  children,\n  testID,\n}: ScreenSectionProps) {\n  return (\n    <View gap=\"m\" testID={testID}>\n      {title ? <SectionHeader actions={actions} description={description} title={title} /> : null}\n      {children}\n    </View>\n  );\n}\n\n/*** Screen section with optional heading, description, actions, and content. */\nexport const ScreenSection = withZoraThemeScope(ScreenSectionInner);\n""",
    )

    legacy = SRC / 'layout'
    for old_dir, target_name in [
        ('app-shell', 'appShellMeta.ts'),
        ('screen', 'screenMeta.ts'),
        ('screen-section', 'screenSectionMeta.ts'),
    ]:
        write(SRC / 'features' / 'layout' / target_name, read(legacy / old_dir / 'meta.ts'))

    write(
        inbound / 'AppShell.test.ts',
        """import { readFileSync } from 'node:fs';\nimport { join } from 'node:path';\n\nimport { describe, expect, test } from 'bun:test';\n\nconst implementationSource = readFileSync(join(import.meta.dir, 'AppShell.tsx'), 'utf8');\nconst layoutTypesSource = readFileSync(join(import.meta.dir, '../../../../types/layout.ts'), 'utf8');\n\ndescribe('AppShell public API', () => {\n  test('does not expose raw style escape hatches', () => {\n    const appShellType = layoutTypesSource.slice(\n      layoutTypesSource.indexOf('export interface AppShellProps'),\n      layoutTypesSource.indexOf('export interface ScreenProps'),\n    );\n    expect(appShellType).not.toContain('StyleProp');\n    expect(appShellType).not.toContain('ViewStyle');\n    expect(appShellType).not.toMatch(/\\bstyle\\??:/);\n    expect(appShellType).not.toMatch(/\\bbodyStyle\\??:/);\n    expect(implementationSource).not.toMatch(/\\bbodyStyle\\b/);\n  });\n});\n""",
    )

    shutil.rmtree(legacy)

    public_path = SRC / 'features' / 'layout' / 'public.ts'
    write(
        public_path,
        """export type {\n  AppShellProps,\n  DividerProps,\n  GridProps,\n  ScreenProps,\n  ScreenSectionProps,\n  ScrollViewProps,\n  ViewProps,\n} from '../../types/layout';\nexport { AppShell } from './adapters/inbound/AppShell';\nexport { Divider } from './adapters/inbound/Divider';\nexport { Grid } from './adapters/inbound/Grid';\nexport { Screen } from './adapters/inbound/Screen';\nexport { ScreenSection } from './adapters/inbound/ScreenSection';\nexport { ScrollView } from './adapters/inbound/ScrollView';\nexport { View } from './adapters/inbound/View';\n""",
    )


def migrate_settings_row() -> None:
    switch_path = SRC / 'patterns' / 'switch-field' / 'SwitchField.tsx'
    text = read(switch_path)
    text = text.replace("import { SettingsRow } from '../settings-row';", "import { ListRow } from '../list';")
    text = text.replace('<SettingsRow', '<ListRow').replace('</SettingsRow>', '</ListRow>')
    text = text.replace('control={', 'action={')
    text = text.replace('built on `SettingsRow`', 'built on `ListRow`')
    write(switch_path, text)

    tree_path = SRC / 'patterns' / 'tree-view' / 'TreeItem.tsx'
    text = read(tree_path)
    text = text.replace("import { SettingsRow } from '../settings-row';", "import { ListRow } from '../list';")
    text = text.replace('<SettingsRow', '<ListRow').replace('</SettingsRow>', '</ListRow>')
    text = text.replace('control={', 'action={')
    text = text.replace('        disabled={node.disabled}\n', '        disabled={node.disabled}\n        selected={isSelected}\n')
    write(tree_path, text)

    gaps = EXAMPLES / 'expo-showcase' / 'app' / 'sections' / 'patternGaps.tsx'
    text = read(gaps)
    text = text.replace('  SettingsRow,\n', '  ListRow,\n')
    start = text.index('      <SectionHeader\n        title="Settings rows"')
    end = text.index('      <SectionHeader\n        title="TreeItem"', start)
    replacement = '''      <SectionHeader\n        title="List rows"\n        description="ListRow covers static, pressable, metadata, and trailing-action rows."\n      />\n      <Card title="ListRow" tone="subtle">\n        <View gap="s">\n          <ListRow\n            title="Account plan"\n            description="Static metadata row."\n            meta={<Badge color="primary">Pro</Badge>}\n          />\n          <ListRow\n            title="Open billing"\n            description="Pressable row with a mock action."\n            onPress={() => undefined}\n            meta="⌘B"\n          />\n          <ListRow\n            title="Background sync"\n            description={syncEnabled ? 'Enabled' : 'Disabled'}\n            action={\n              <IconButton\n                icon={{ name: syncEnabled ? 'pause-outline' : 'play-outline' }}\n                label={syncEnabled ? 'Disable background sync' : 'Enable background sync'}\n                onPress={() => setSyncEnabled((enabled) => !enabled)}\n              />\n            }\n          />\n        </View>\n      </Card>\n\n'''
    write(gaps, text[:start] + replacement + text[end:])
    shutil.rmtree(SRC / 'patterns' / 'settings-row')


def migrate_tile_grid() -> None:
    source = SRC / 'patterns' / 'tile-grid'
    target = SRC / 'features' / 'palette-item'
    inbound = target / 'adapters' / 'inbound'
    inbound.mkdir(parents=True, exist_ok=True)

    component = read(source / 'PaletteItem.tsx')
    component = component.replace("../../features/card/public", "../../../card/public")
    component = component.replace("../../features/layout/public", "../../../layout/public")
    component = component.replace("../../features/typography/public", "../../../typography/public")
    component = component.replace("../../theme/useZoraTheme", "../../../../theme/useZoraTheme")
    component = component.replace("../../theme/withZoraThemeScope", "../../../../theme/withZoraThemeScope")
    component = component.replace("import type { PaletteItemProps } from './types';", "import type { PaletteItemProps } from '../../../../types/palette-item';")
    write(inbound / 'PaletteItem.tsx', component)

    write(
        SRC / 'types' / 'palette-item.ts',
        """import type { ButtonIconSpec } from '@ankhorage/surface';\nimport type React from 'react';\n\nimport type { ZoraBaseProps } from '../theme/ZoraBaseProps';\n\nexport interface PaletteItemProps extends ZoraBaseProps {\n  title: React.ReactNode;\n  description?: React.ReactNode;\n  icon?: ButtonIconSpec;\n  badge?: React.ReactNode;\n  selected?: boolean;\n  disabled?: boolean;\n  onPress?: () => void;\n}\n""",
    )
    write(
        target / 'paletteItemMeta.ts',
        """import type { ZoraComponentMeta } from '../../metadata';\n\nexport const paletteItemMeta = {\n  name: 'PaletteItem',\n  category: 'pattern',\n  directManifestNode: false,\n  allowedChildren: [],\n  note: 'Palette option pattern; not represented as a manifest node in v1.',\n  props: {},\n} as const satisfies ZoraComponentMeta;\n""",
    )
    write(
        target / 'public.ts',
        """export type { PaletteItemProps } from '../../types/palette-item';\nexport { PaletteItem } from './adapters/inbound/PaletteItem';\n""",
    )

    patterns = EXAMPLES / 'expo-showcase' / 'app' / 'patterns.tsx'
    text = read(patterns)
    text = text.replace('  TileGrid,\n', '  Grid,\n')
    text = text.replace('<TileGrid columns={4}>', '<Grid cols={4} gap="m">')
    text = text.replace('</TileGrid>', '</Grid>')
    write(patterns, text)

    shutil.rmtree(source)


def rewrite_showcase_layouts() -> None:
    path = EXAMPLES / 'expo-showcase' / 'app' / 'sections' / 'layoutsShowcase.tsx'
    write(
        path,
        """import {\n  AppShell,\n  Badge,\n  Button,\n  Card,\n  Grid,\n  KeyboardAvoidingView,\n  ScreenSection,\n  ScrollView,\n  Surface,\n  Text,\n  View,\n} from '@ankhorage/zora';\nimport React from 'react';\n\nexport function LayoutsShowcaseSection() {\n  return (\n    <ScreenSection title=\"Layouts\">\n      <Card\n        title=\"Focused composition\"\n        description=\"View composes alignment, spacing, and responsive direction without layout-specific wrappers.\"\n      >\n        <KeyboardAvoidingView behavior=\"padding\">\n          <View align=\"center\" justify=\"center\" px=\"m\" py=\"xl\">\n            <Card\n              compact\n              eyebrow=\"Secure area\"\n              title=\"Welcome back\"\n              description=\"Focused auth flows compose directly from canonical primitives.\"\n              footer={<Text emphasis=\"muted\">Need access? Contact an admin.</Text>}\n            >\n              <View gap=\"m\">\n                <Button size=\"s\">Continue</Button>\n              </View>\n            </Card>\n          </View>\n        </KeyboardAvoidingView>\n      </Card>\n\n      <Card\n        title=\"Responsive regions\"\n        description=\"The owning feature decides what each region means; View owns only geometry.\"\n      >\n        <View direction={{ base: 'column', lg: 'row' }} gap=\"m\">\n          <Surface variant=\"outline\" p=\"m\" width={{ base: '100%', lg: 220 }}>\n            <View gap=\"s\">\n              <Text weight=\"semiBold\">Supporting region</Text>\n              <Badge color=\"neutral\">Navigation or tools</Badge>\n            </View>\n          </Surface>\n          <Surface flex={1} variant=\"subtle\" p=\"m\">\n            <Text>Main content remains the semantic owner's responsibility.</Text>\n          </Surface>\n        </View>\n      </Card>\n\n      <Card title=\"Auto-fit grid\" description=\"Grid fills available width from a minimum item size.\">\n        <Grid minItemWidth={160} gap=\"m\">\n          <Surface variant=\"subtle\" p=\"m\"><Text>One</Text></Surface>\n          <Surface variant=\"subtle\" p=\"m\"><Text>Two</Text></Surface>\n          <Surface variant=\"subtle\" p=\"m\"><Text>Three</Text></Surface>\n        </Grid>\n      </Card>\n\n      <Card title=\"Bounded scrolling\" description=\"ScrollView is explicit when a nested region owns scrolling.\">\n        <View height={150}>\n          <ScrollView>\n            <View gap=\"s\" p=\"s\">\n              {Array.from({ length: 8 }, (_, index) => (\n                <Surface key={index} variant=\"outline\" p=\"s\">\n                  <Text>Scrollable item {index + 1}</Text>\n                </Surface>\n              ))}\n            </View>\n          </ScrollView>\n        </View>\n      </Card>\n\n      <Card title=\"App shell\" description=\"AppShell provides only stable app-frame slots, not navigation semantics.\">\n        <View height={220}>\n          <AppShell\n            header={<Surface p=\"s\" variant=\"outline\"><Text weight=\"semiBold\">Header</Text></Surface>}\n            footer={<Surface p=\"s\" variant=\"outline\"><Text emphasis=\"muted\">Footer</Text></Surface>}\n          >\n            <View flex={1} p=\"m\"><Text>Shell content</Text></View>\n          </AppShell>\n        </View>\n      </Card>\n    </ScreenSection>\n  );\n}\n""",
    )

    foundation = EXAMPLES / 'expo-showcase' / 'app' / 'sections' / 'foundationPrimitives.tsx'
    text = read(foundation)
    text = text.replace('  Show,\n', '')
    show_start = text.index('      <Card\n        title="Divider, Spacer, and Show"')
    show_end = text.index('    </ScreenSection>', show_start)
    replacement = '''      <Card\n        title="Divider and spacing"\n        description="View gap and dimensions cover ordinary spacing without helper components."\n      >\n        <View gap="s">\n          <Text>First block</Text>\n          <Divider />\n          <View height="s" />\n          <Text>Second block after explicit spacing</Text>\n        </View>\n      </Card>\n'''
    text = text[:show_start] + replacement + text[show_end:]
    text = text.replace('title="Stack and Inline"', 'title="View flow"')
    text = text.replace('Use Stack for vertical rhythm and Inline for wrapped horizontal groups.', 'Use View for vertical rhythm and responsive horizontal groups.')
    text = text.replace('title="Grid and Container"', 'title="Grid and bounded View"')
    text = text.replace('Responsive containers and grids keep catalog surfaces aligned.', 'Responsive View constraints and grids keep catalog surfaces aligned.')
    text = text.replace('title="Center and Box"', 'title="View alignment"')
    text = text.replace('Box is the flexible primitive; Center aligns its children.', 'View owns flexible geometry and alignment.')
    text = text.replace('Centered Box', 'Centered View')
    write(foundation, text)


def update_registry_and_metadata() -> None:
    registry = SRC / 'registry.ts'
    text = read(registry)
    text = text.replace("import { Show } from '@ankhorage/surface';\n", '')
    text = text.replace(
        "import { View, Divider, Grid } from './features/layout/public';\nimport { ContentRail } from './features/layout/public';\nimport { FlatList, SectionList, ScrollView, View } from './features/list/public';",
        "import { ContentRail } from './features/content-rail/public';\nimport { PaletteItem } from './features/palette-item/public';\nimport { AppShell, Divider, Grid, Screen, ScreenSection, ScrollView, View } from './features/layout/public';\nimport { FlatList, SectionList } from './features/list/public';",
    )
    for line in [
        "import { AppShell } from './layout/app-shell';\n",
        "import { Screen } from './layout/screen';\n",
        "import { ScreenSection } from './layout/screen-section';\n",
        "import { SettingsLayout } from './layout/settings-layout';\n",
        "import { SidebarLayout } from './layout/sidebar-layout';\n",
        "import { TopbarLayout } from './layout/topbar-layout';\n",
        "import { SettingsRow } from './patterns/settings-row';\n",
        "import { PaletteItem, TileGrid } from './patterns/tile-grid';\n",
    ]:
        text = text.replace(line, '')
    for name in ['SettingsLayout', 'SidebarLayout', 'TopbarLayout', 'SettingsRow', 'TileGrid']:
        text = re.sub(rf'^  {name},\n', '', text, flags=re.MULTILINE)
    anchor = '  SectionList,\n'
    text = text.replace(anchor, anchor + '  ScrollView,\n  View,\n', 1)
    write(registry, text)

    meta = SRC / 'metadata' / 'componentMeta.ts'
    text = read(meta)
    text = text.replace("import { contentRailMeta } from '../features/layout/contentRailMeta';", "import { contentRailMeta } from '../features/content-rail/contentRailMeta';")
    text = text.replace("import { dividerMeta } from '../features/layout/dividerMeta';", "import { paletteItemMeta } from '../features/palette-item/paletteItemMeta';\nimport { appShellMeta } from '../features/layout/appShellMeta';\nimport { dividerMeta } from '../features/layout/dividerMeta';")
    text = text.replace("import { gridMeta } from '../features/layout/gridMeta';", "import { gridMeta } from '../features/layout/gridMeta';\nimport { screenMeta } from '../features/layout/screenMeta';\nimport { screenSectionMeta } from '../features/layout/screenSectionMeta';")
    for line in [
        "import { appShellMeta } from '../layout/app-shell/meta';\n",
        "import { screenMeta } from '../layout/screen/meta';\n",
        "import { screenSectionMeta } from '../layout/screen-section/meta';\n",
        "import { settingsLayoutMeta } from '../layout/settings-layout/meta';\n",
        "import { sidebarLayoutMeta } from '../layout/sidebar-layout/meta';\n",
        "import { topbarLayoutMeta } from '../layout/topbar-layout/meta';\n",
        "import { settingsRowMeta } from '../patterns/settings-row/meta';\n",
        "import { paletteItemMeta, tileGridMeta } from '../patterns/tile-grid/meta';\n",
    ]:
        text = text.replace(line, '')
    for line in [
        '  SettingsLayout: settingsLayoutMeta,\n',
        '  SidebarLayout: sidebarLayoutMeta,\n',
        '  TopbarLayout: topbarLayoutMeta,\n',
        '  SettingsRow: settingsRowMeta,\n',
        '  TileGrid: tileGridMeta,\n',
    ]:
        text = text.replace(line, '')
    write(meta, text)


def update_root_exports() -> None:
    path = SRC / 'index.ts'
    text = read(path)
    content_types = """export type {\n  ContentRailControlPressEvent,\n  ContentRailDirection,\n  ContentRailItemSize,\n  ContentRailMotion,\n  ContentRailProps,\n  ContentRailSpacing,\n  ContentRailVisibleRangeChangeEvent,\n} from './features/layout/public';\n"""
    text = text.replace(content_types, '')
    text = text.replace("export { ContentRail } from './features/layout/public';\n", '')
    layout_type_line = "export type { DividerProps, GridProps, ScrollViewProps, ViewProps } from './features/layout/public';"
    text = text.replace(
        layout_type_line,
        "export type { AppShellProps, DividerProps, GridProps, ScreenProps, ScreenSectionProps, ScrollViewProps, ViewProps } from './features/layout/public';",
    )
    text = text.replace(
        "export { Divider, Grid, ScrollView, View } from './features/layout/public';",
        "export { AppShell, Divider, Grid, Screen, ScreenSection, ScrollView, View } from './features/layout/public';",
    )
    content_export = """export type {\n  ContentRailControlPressEvent,\n  ContentRailDirection,\n  ContentRailItemSize,\n  ContentRailMotion,\n  ContentRailProps,\n  ContentRailSpacing,\n  ContentRailVisibleRangeChangeEvent,\n} from './features/content-rail/public';\nexport { ContentRail } from './features/content-rail/public';\n"""
    marker = "export { KeyboardAvoidingView,"
    marker_index = text.index(marker)
    line_end = text.index("\n", text.index("} from './features/keyboard-avoiding-view/public';", marker_index)) + 1
    text = text[:line_end] + content_export + text[line_end:]

    text = re.sub(r"export type \{ AppShellProps \} from './layout/app-shell';\nexport \{ AppShell \} from './layout/app-shell';\nexport type \{ ScreenProps \} from './layout/screen';\nexport \{ Screen \} from './layout/screen';\nexport type \{ ScreenSectionProps \} from './layout/screen-section';\nexport \{ ScreenSection \} from './layout/screen-section';\nexport type \{ SettingsLayoutProps \} from './layout/settings-layout';\nexport \{ SettingsLayout \} from './layout/settings-layout';\nexport type \{ SidebarLayoutProps \} from './layout/sidebar-layout';\nexport \{ SidebarLayout \} from './layout/sidebar-layout';\nexport type \{ TopbarLayoutProps \} from './layout/topbar-layout';\nexport \{ TopbarLayout \} from './layout/topbar-layout';\n", '', text)
    text = text.replace("export type { SettingsRowProps } from './patterns/settings-row';\nexport { SettingsRow } from './patterns/settings-row';\n", '')
    text = text.replace("export type { PaletteItemProps, TileGridProps } from './patterns/tile-grid';\nexport { PaletteItem, TileGrid } from './patterns/tile-grid';\n", '')
    palette_export = "export type { PaletteItemProps } from './features/palette-item/public';\nexport { PaletteItem } from './features/palette-item/public';\n"
    marker = "export { MissingElement, type MissingElementProps } from './features/missing-element/public';\n"
    text = text.replace(marker, marker + palette_export)
    write(path, text)


def update_structure_tests() -> None:
    showcase = SRC / 'showcaseCoverage.test.ts'
    text = read(showcase)
    text = re.sub(
        r"  foundation: \[.*?\],\n  features:",
        "  foundation: ['Divider', 'Grid', 'Surface', 'View'],\n  features:",
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r"  layouts: \[.*?\],\n  patterns:",
        "  layouts: ['AppShell', 'Screen', 'ScreenSection', 'ScrollView'],\n  patterns:",
        text,
        flags=re.DOTALL,
    )
    text = text.replace("    'SettingsRow',\n", '')
    text = text.replace("    'TileGrid',\n", '')
    write(showcase, text)

    scope = SRC / 'theme' / 'themeScopeStructure.test.ts'
    text = read(scope)
    text = text.replace("  join(srcDir, 'layout'),\n  join(srcDir, 'foundation'),\n", '')
    text = re.sub(r"\n  join\(srcDir, 'layout'.*?\n\n", '\n', text, flags=re.DOTALL)
    for line in [
        "  join(srcDir, 'patterns', 'settings-row', 'SettingsRow.tsx'),\n",
        "  join(srcDir, 'patterns', 'tile-grid', 'PaletteItem.tsx'),\n",
        "  join(srcDir, 'patterns', 'tile-grid', 'TileGrid.tsx'),\n",
        "  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'Box.tsx'),\n",
        "  join(srcDir, 'foundation', 'Center.tsx'),\n",
        "  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'Container.tsx'),\n",
        "  join(srcDir, 'foundation', 'Inline.tsx'),\n",
        "  join(srcDir, 'foundation', 'Show.tsx'),\n",
        "  join(srcDir, 'foundation', 'Spacer.tsx'),\n",
        "  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'Stack.tsx'),\n",
    ]:
        text = text.replace(line, '')
    insertion = """  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'AppShell.tsx'),\n  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'Screen.tsx'),\n  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'ScreenSection.tsx'),\n  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'ScrollView.tsx'),\n  join(srcDir, 'features', 'layout', 'adapters', 'inbound', 'View.tsx'),\n  join(srcDir, 'features', 'content-rail', 'adapters', 'inbound', 'ContentRail.tsx'),\n  join(srcDir, 'features', 'palette-item', 'adapters', 'inbound', 'PaletteItem.tsx'),\n"""
    marker = "  join(srcDir, 'features', 'list', 'adapters', 'inbound', 'FlatList.tsx'),\n"
    text = text.replace(marker, insertion + marker)
    text = re.sub(r"\n  join\(srcDir, 'layout'.*?\n\n", '\n', text, flags=re.DOTALL)
    for line in [
        "  join(srcDir, 'patterns', 'settings-row', 'types.ts'),\n",
        "  join(srcDir, 'patterns', 'tile-grid', 'types.ts'),\n",
    ]:
        text = text.replace(line, '')
    marker = "  join(srcDir, 'types', 'app-bar.ts'),\n"
    text = text.replace(marker, "  join(srcDir, 'types', 'layout.ts'),\n  join(srcDir, 'types', 'palette-item.ts'),\n" + marker)
    write(scope, text)


def add_changeset() -> None:
    write(
        ROOT / '.changeset' / 'surface-six-layout.md',
        """---\n'@ankhorage/zora': major\n---\n\nAdopt the Surface 6 native-named layout primitives, remove redundant layout wrappers, and move semantic layout capabilities to their canonical feature owners.\n""",
    )


def main() -> None:
    remove_plain_view_from_react_native_imports()
    replace_removed_layout_prop_types()
    move_content_rail()
    write_layout_semantics()
    migrate_settings_row()
    migrate_tile_grid()
    rewrite_showcase_layouts()
    update_registry_and_metadata()
    update_root_exports()
    update_structure_tests()
    add_changeset()
    SELF.unlink(missing_ok=True)
    BRANCH_WORKFLOW.unlink(missing_ok=True)


if __name__ == '__main__':
    main()
