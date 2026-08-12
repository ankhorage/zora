from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    content = file_path.read_text()
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one match in {path}, found {count}: {old!r}")
    file_path.write_text(content.replace(old, new, 1))


replace_once(
    "src/theme/ThemeModeToggleProps.ts",
    "export type ThemeModeToggleProps = Pick<IconButtonProps, 'disabled' | 'size' | 'testID'>;",
    "export type ThemeModeToggleProps = Pick<\n  IconButtonProps,\n  'disabled' | 'interactionPolicy' | 'size' | 'testID'\n>;",
)

replace_once(
    "src/theme/ThemeModeToggle.tsx",
    "export function ThemeModeToggle({ disabled, size = 'm', testID }: ThemeModeToggleProps) {",
    "export function ThemeModeToggle({\n  disabled,\n  interactionPolicy,\n  size = 'm',\n  testID,\n}: ThemeModeToggleProps) {",
)
replace_once(
    "src/theme/ThemeModeToggle.tsx",
    "      icon={{ name: state.iconName }}\n      label={state.label}",
    "      icon={{ name: state.iconName }}\n      interactionPolicy={interactionPolicy}\n      label={state.label}",
)

replace_once(
    "src/registry.ts",
    "import { ZoraDrawerContent } from './patterns/zora-drawer-content';\nimport { ZoraTabBar } from './patterns/zora-tab-bar';",
    "import { ZoraDrawerContent } from './patterns/zora-drawer-content';\nimport { ZoraTabBar } from './patterns/zora-tab-bar';\nimport { ThemeModeToggle } from './theme/ThemeModeToggle';",
)
replace_once(
    "src/registry.ts",
    "  Toolbar,\n  ToolbarAction,\n  Box,",
    "  Toolbar,\n  ToolbarAction,\n  ThemeModeToggle,\n  Box,",
)

replace_once(
    "src/metadata/allowedChildren.ts",
    "  'ButtonGroup',\n  'Input',",
    "  'ButtonGroup',\n  'ThemeModeToggle',\n  'Input',",
)

Path("src/theme/ThemeModeToggle.meta.ts").write_text(
    """import type { ZoraComponentMeta } from '../metadata';\n\nexport const themeModeToggleMeta = {\n  name: 'ThemeModeToggle',\n  category: 'component',\n  directManifestNode: true,\n  allowedChildren: [],\n  blueprint: {\n    label: 'Theme mode toggle',\n    defaultProps: {\n      size: 'm',\n    },\n  },\n  props: {\n    disabled: {\n      type: 'boolean',\n      category: 'Behavior',\n      label: 'Disabled',\n      default: false,\n    },\n    size: {\n      type: 'enum',\n      category: 'Style',\n      label: 'Size',\n      enum: ['s', 'm', 'l'],\n      default: 'm',\n    },\n  },\n} as const satisfies ZoraComponentMeta;\n"""
)

replace_once(
    "src/metadata/componentMeta.ts",
    "import { zoraTabBarMeta } from '../patterns/zora-tab-bar/meta';\nimport type { ZoraComponentMetaRegistry } from './types';",
    "import { zoraTabBarMeta } from '../patterns/zora-tab-bar/meta';\nimport { themeModeToggleMeta } from '../theme/ThemeModeToggle.meta';\nimport type { ZoraComponentMetaRegistry } from './types';",
)
replace_once(
    "src/metadata/componentMeta.ts",
    "  Toolbar: toolbarMeta,\n  ToolbarAction: toolbarActionMeta,\n  AppShell: appShellMeta,",
    "  Toolbar: toolbarMeta,\n  ToolbarAction: toolbarActionMeta,\n  ThemeModeToggle: themeModeToggleMeta,\n  AppShell: appShellMeta,",
)

replace_once(
    "src/registry.test.ts",
    "const NON_RUNTIME_COMPONENT_EXPORTS = new Set(['SelectionProvider', 'ToastProvider']);\nconst REGISTRY_SNAPSHOT_PREFIX = 'ZORA_REGISTRY_SNAPSHOT:';",
    "const NON_RUNTIME_COMPONENT_EXPORTS = new Set(['SelectionProvider', 'ToastProvider']);\nconst RUNTIME_THEME_COMPONENT_EXPORTS = ['ThemeModeToggle'] as const;\nconst REGISTRY_SNAPSHOT_PREFIX = 'ZORA_REGISTRY_SNAPSHOT:';",
)
replace_once(
    "src/registry.test.ts",
    "async function listPublicConcreteComponentExports(): Promise<readonly string[]> {\n  const source = await Bun.file('src/index.ts').text();\n  return Array.from(\n    source.matchAll(\n      /export\\s+\\{([^}]+)\\}\\s+from '\\.\\/(components\\/[^']+|foundation|layout\\/[^']+|patterns\\/[^']+)';/g,\n    ),\n  )\n    .flatMap((match) => match[1].split(',').map((item) => item.trim()))\n    .map((item) => item.split(' as ')[0].trim())\n    .filter((name) => /^[A-Z][A-Za-z0-9]+$/.test(name))\n    .filter((name) => !NON_RUNTIME_COMPONENT_EXPORTS.has(name))\n    .sort();\n}",
    "async function listPublicConcreteComponentExports(): Promise<readonly string[]> {\n  const source = await Bun.file('src/index.ts').text();\n  const componentExports = Array.from(\n    source.matchAll(\n      /export\\s+\\{([^}]+)\\}\\s+from '\\.\\/(components\\/[^']+|foundation|layout\\/[^']+|patterns\\/[^']+)';/g,\n    ),\n  )\n    .flatMap((match) => match[1].split(',').map((item) => item.trim()))\n    .map((item) => item.split(' as ')[0].trim())\n    .filter((name) => /^[A-Z][A-Za-z0-9]+$/.test(name))\n    .filter((name) => !NON_RUNTIME_COMPONENT_EXPORTS.has(name));\n\n  return [...componentExports, ...RUNTIME_THEME_COMPONENT_EXPORTS].sort();\n}",
)

replace_once(
    "src/metadata/componentMeta.test.ts",
    "      .filter((name) => !['ToastProvider'].includes(name));\n\n    for (const name of componentExports) {",
    "      .filter((name) => !['ToastProvider'].includes(name));\n    componentExports.push('ThemeModeToggle');\n\n    for (const name of componentExports) {",
)
replace_once(
    "src/metadata/componentMeta.test.ts",
    "      'Button',\n      'Input',",
    "      'Button',\n      'ThemeModeToggle',\n      'Input',",
)
replace_once(
    "src/metadata/componentMeta.test.ts",
    "  test('Progress is a direct manifest leaf with serializable defaults', () => {",
    "  test('ThemeModeToggle is a direct manifest leaf with serializable defaults', () => {\n    expect(ZORA_COMPONENT_META.ThemeModeToggle.directManifestNode).toBe(true);\n    expect(ZORA_COMPONENT_META.ThemeModeToggle.allowedChildren).toEqual([]);\n    expect(ZORA_COMPONENT_META.ThemeModeToggle.blueprint?.defaultProps).toEqual({ size: 'm' });\n  });\n\n  test('Progress is a direct manifest leaf with serializable defaults', () => {",
)

Path(".changeset/calm-moons-toggle.md").write_text(
    """---\n'@ankhorage/zora': minor\n---\n\nMake ThemeModeToggle manifest-authorable by registering it in the runtime component registry, publishing static authoring metadata, and supporting interaction-policy injection.\n"""
)
