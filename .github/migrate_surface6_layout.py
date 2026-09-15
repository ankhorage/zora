from __future__ import annotations

import json
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
EXAMPLES = ROOT / "examples"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def relative_module(source: Path, target: Path) -> str:
    relative = os.path.relpath(target, source.parent).replace(os.sep, "/")
    return relative if relative.startswith(".") else f"./{relative}"


def parse_specifiers(body: str) -> list[str]:
    return [part.strip() for part in body.replace("\n", " ").split(",") if part.strip()]


def render_import(specifiers: list[str], module: str) -> str:
    unique: list[str] = []
    for specifier in specifiers:
        if specifier not in unique:
            unique.append(specifier)
    if not unique:
        return ""
    if len(unique) == 1:
        return f"import {{ {unique[0]} }} from '{module}';"
    return "import {\n  " + ",\n  ".join(unique) + f",\n}} from '{module}';"


IMPORT_RE = re.compile(
    r"import\s*\{(?P<body>.*?)\}\s*from\s*['\"](?P<module>[^'\"]+)['\"];",
    re.DOTALL,
)


def rewrite_named_imports(path: Path, text: str) -> tuple[str, set[str], set[str]]:
    replaced_layout_names: set[str] = set()
    replaced_foundation_names: set[str] = set()
    needs_surface_show = False

    def replacement(match: re.Match[str]) -> str:
        nonlocal needs_surface_show
        module = match.group("module")
        specifiers = parse_specifiers(match.group("body"))

        is_internal_layout = module.endswith("layout/public")
        is_zora_root = module == "@ankhorage/zora"
        is_foundation = module.endswith("/foundation") or module == "./foundation"

        if is_internal_layout or is_zora_root:
            next_specifiers: list[str] = []
            for specifier in specifiers:
                mapped = {
                    "Box": "View",
                    "Stack": "View",
                    "Container": "View",
                    "type BoxProps": "type ViewProps",
                    "type StackProps": "type ViewProps",
                    "type ContainerProps": "type ViewProps",
                }.get(specifier, specifier)
                if mapped != specifier:
                    replaced_layout_names.add(specifier.replace("type ", ""))
                next_specifiers.append(mapped)
            specifiers = next_specifiers

        if is_foundation or is_zora_root:
            next_specifiers = []
            for specifier in specifiers:
                plain = specifier.replace("type ", "")
                if plain in {"Center", "Inline", "Spacer"}:
                    replaced_foundation_names.add(plain)
                    continue
                if plain in {"CenterProps", "InlineProps", "SpacerProps"}:
                    continue
                if plain == "Show" and is_foundation:
                    replaced_foundation_names.add("Show")
                    needs_surface_show = True
                    continue
                if plain == "ShowProps" and is_foundation:
                    continue
                next_specifiers.append(specifier)
            specifiers = next_specifiers

        return render_import(specifiers, module)

    text = IMPORT_RE.sub(replacement, text)

    if replaced_foundation_names.intersection({"Center", "Inline", "Spacer"}):
        if path.is_relative_to(SRC):
            layout_module = relative_module(path, SRC / "features" / "layout" / "public")
        else:
            layout_module = "@ankhorage/zora"
        text = ensure_named_import(text, layout_module, "View")

    if needs_surface_show:
        text = ensure_named_import(text, "@ankhorage/surface", "Show")

    return text, replaced_layout_names, replaced_foundation_names


def ensure_named_import(text: str, module: str, specifier: str) -> str:
    matches = list(IMPORT_RE.finditer(text))
    for match in matches:
        if match.group("module") != module:
            continue
        specifiers = parse_specifiers(match.group("body"))
        if specifier not in specifiers:
            specifiers.append(specifier)
        return text[: match.start()] + render_import(specifiers, module) + text[match.end() :]
    return render_import([specifier], module) + "\n" + text


def rewrite_spacers(text: str) -> str:
    pattern = re.compile(r"<Spacer(?P<attrs>[^>]*)/>")

    def replacement(match: re.Match[str]) -> str:
        attrs = match.group("attrs")
        axis_match = re.search(r'axis="(horizontal|vertical|both)"', attrs)
        size_match = re.search(r'size="([^"]+)"', attrs)
        test_id_match = re.search(r"testID=({[^}]+}|\"[^\"]+\")", attrs)
        axis = axis_match.group(1) if axis_match else "vertical"
        size = size_match.group(1) if size_match else "m"
        dimensions = (
            [f'width="{size}"']
            if axis == "horizontal"
            else [f'height="{size}"']
            if axis == "vertical"
            else [f'height="{size}"', f'width="{size}"']
        )
        if test_id_match:
            dimensions.append(f"testID={test_id_match.group(1)}")
        known = re.sub(r'\s*(axis|size)="[^"]+"', "", attrs)
        known = re.sub(r"\s*testID=({[^}]+}|\"[^\"]+\")", "", known).strip()
        if known:
            raise RuntimeError(f"Unsupported Spacer props: {known}")
        return "<View " + " ".join(dimensions) + " />"

    return pattern.sub(replacement, text)


def transform_source(path: Path) -> None:
    text = read(path)
    text, layout_names, foundation_names = rewrite_named_imports(path, text)

    if "Box" in layout_names:
        text = re.sub(r"<(/?)Box\b", r"<\1View", text)
    if "Stack" in layout_names:
        text = re.sub(r"<(/?)Stack\b", r"<\1View", text)
    if "Container" in layout_names:
        text = re.sub(r"<(/?)Container\b", r"<\1View", text)

    if "Inline" in foundation_names:
        text = re.sub(r"<Inline\b", '<View direction="row"', text)
        text = text.replace("</Inline>", "</View>")
    if "Center" in foundation_names:
        text = re.sub(r"<Center\b", '<View align="center" justify="center"', text)
        text = text.replace("</Center>", "</View>")
    if "Spacer" in foundation_names:
        text = rewrite_spacers(text)

    write(path, text)


def create_layout_api() -> None:
    write(
        SRC / "types" / "layout.ts",
        """import type {\n  DividerProps as SurfaceDividerProps,\n  GridProps as SurfaceGridProps,\n  ScrollViewProps as SurfaceScrollViewProps,\n  ViewProps as SurfaceViewProps,\n} from '@ankhorage/surface';\n\nimport type { ZoraBaseProps } from '../theme/ZoraBaseProps';\n\nexport interface ViewProps extends ZoraBaseProps, Omit<SurfaceViewProps, 'mode' | 'themeId'> {}\nexport interface ScrollViewProps\n  extends ZoraBaseProps, Omit<SurfaceScrollViewProps, 'mode' | 'themeId'> {}\nexport interface DividerProps\n  extends ZoraBaseProps, Omit<SurfaceDividerProps, 'mode' | 'themeId'> {}\nexport interface GridProps extends ZoraBaseProps, Omit<SurfaceGridProps, 'mode' | 'themeId'> {}\n""",
    )
    write(
        SRC / "features" / "layout" / "adapters" / "inbound" / "View.tsx",
        """import { View as SurfaceView } from '@ankhorage/surface';\nimport React from 'react';\n\nimport { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';\nimport type { ViewProps } from '../../../../types/layout';\n\n/*** Adapts the token-aware Surface View primitive to ZORA theme scope. */\nexport const View = withZoraThemeScope(ViewInner);\n\n/*** Forwards ZORA layout props to the published Surface View boundary. */\nfunction ViewInner({\n  themeId: _themeId,\n  mode: _mode,\n  interactionPolicy: _interactionPolicy,\n  ...props\n}: ViewProps) {\n  return <SurfaceView {...props} />;\n}\n""",
    )
    write(
        SRC / "features" / "layout" / "adapters" / "inbound" / "ScrollView.tsx",
        """import { ScrollView as SurfaceScrollView } from '@ankhorage/surface';\nimport React from 'react';\n\nimport { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';\nimport type { ScrollViewProps } from '../../../../types/layout';\n\n/*** Adapts the token-aware Surface ScrollView primitive to ZORA theme scope. */\nexport const ScrollView = withZoraThemeScope(ScrollViewInner);\n\n/*** Forwards ZORA scrolling props to the published Surface ScrollView boundary. */\nfunction ScrollViewInner({\n  themeId: _themeId,\n  mode: _mode,\n  interactionPolicy: _interactionPolicy,\n  ...props\n}: ScrollViewProps) {\n  return <SurfaceScrollView {...props} />;\n}\n""",
    )
    write(
        SRC / "features" / "layout" / "viewMeta.ts",
        """import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';\nimport type { ZoraComponentMeta } from '../../metadata/types';\nimport { LAYOUT_PROPS } from './constants';\n\nexport const viewMeta = {\n  name: 'View',\n  category: 'foundation',\n  directManifestNode: true,\n  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],\n  props: {\n    ...LAYOUT_PROPS,\n    direction: { type: 'enum', category: 'Layout', enum: ['row', 'column'] },\n    gap: { type: 'spacing', category: 'Spacing' },\n    rowGap: { type: 'spacing', category: 'Spacing' },\n    columnGap: { type: 'spacing', category: 'Spacing' },\n    align: {\n      type: 'enum',\n      category: 'Layout',\n      enum: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],\n    },\n    justify: {\n      type: 'enum',\n      category: 'Layout',\n      enum: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],\n    },\n    wrap: { type: 'enum', category: 'Layout', enum: ['nowrap', 'wrap'] },\n    bg: { type: 'color', category: 'Style' },\n    borderColor: { type: 'color', category: 'Style' },\n    borderWidth: { type: 'number', category: 'Style' },\n  },\n} as const satisfies ZoraComponentMeta;\n""",
    )
    write(
        SRC / "features" / "layout" / "scrollViewMeta.ts",
        """import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';\nimport type { ZoraComponentMeta } from '../../metadata/types';\nimport { LAYOUT_PROPS } from './constants';\n\nexport const scrollViewMeta = {\n  name: 'ScrollView',\n  category: 'foundation',\n  directManifestNode: true,\n  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],\n  props: {\n    ...LAYOUT_PROPS,\n    horizontal: { type: 'boolean', category: 'Layout', default: false },\n  },\n} as const satisfies ZoraComponentMeta;\n""",
    )
    write(
        SRC / "features" / "layout" / "public.ts",
        """export type { DividerProps, GridProps, ScrollViewProps, ViewProps } from '../../types/layout';\nexport { Divider } from './adapters/inbound/Divider';\nexport { Grid } from './adapters/inbound/Grid';\nexport { ScrollView } from './adapters/inbound/ScrollView';\nexport { View } from './adapters/inbound/View';\n""",
    )
    for obsolete in [
        "Box.tsx",
        "Container.tsx",
        "Stack.tsx",
    ]:
        (SRC / "features" / "layout" / "adapters" / "inbound" / obsolete).unlink(missing_ok=True)
    for obsolete in ["boxMeta.ts", "containerMeta.ts", "stackMeta.ts"]:
        (SRC / "features" / "layout" / obsolete).unlink(missing_ok=True)


def rewrite_screen() -> None:
    path = SRC / "layout" / "screen" / "Screen.tsx"
    write(
        path,
        """import React from 'react';\n\nimport { ScrollView, View } from '../../features/layout/public';\nimport { resolvePageMaxWidth } from '../../internal/recipes';\nimport { withZoraThemeScope } from '../../theme/withZoraThemeScope';\nimport type { ScreenProps } from './types';\n\nfunction ScreenInner({\n  themeId: _themeId,\n  mode: _mode,\n  interactionPolicy: _interactionPolicy,\n  children,\n  footer,\n  scroll = true,\n  width = 'default',\n  testID,\n}: ScreenProps) {\n  const content = (\n    <View\n      alignSelf=\"center\"\n      gap=\"l\"\n      maxWidth={resolvePageMaxWidth(width)}\n      px={{ base: 16, md: 24, lg: 32 }}\n      py=\"xl\"\n      testID={testID}\n      width=\"100%\"\n    >\n      {children}\n      {footer}\n    </View>\n  );\n\n  if (!scroll) {\n    return (\n      <View bg=\"background\" flex={1} minHeight={0} minWidth={0}>\n        {content}\n      </View>\n    );\n  }\n\n  return (\n    <ScrollView bg=\"background\" flex={1} minHeight={0} minWidth={0}>\n      {content}\n    </ScrollView>\n  );\n}\n\n/**\n * Outer content boundary for one app screen.\n *\n * By default Screen owns normal vertical scrolling. Set `scroll={false}` to preserve a bounded\n * viewport and delegate scroll or gesture ownership to specialized children such as lists, maps,\n * chats, canvases, or editors. Content width and page spacing remain stable in both modes.\n */\nexport const Screen = withZoraThemeScope(ScreenInner);\n""",
    )


def update_index() -> None:
    path = SRC / "index.ts"
    text = read(path)
    text = re.sub(
        r"export type \{\n  BoxProps,\n  ContainerProps,\n  DividerProps,\n  GridProps,\n  StackProps,\n\} from './features/layout/public';\n",
        "export type { DividerProps, GridProps, ScrollViewProps, ViewProps } from './features/layout/public';\n",
        text,
    )
    text = text.replace(
        "export { Box, Container, Divider, Grid, Stack } from './features/layout/public';",
        "export { Divider, Grid, ScrollView, View } from './features/layout/public';",
    )
    text = re.sub(
        r"export type \{ CenterProps, InlineProps, ShowProps, SpacerProps \} from './foundation';\nexport \{ Center, Inline, Show, Spacer \} from './foundation';\n",
        "",
        text,
    )
    write(path, text)


def update_registry() -> None:
    path = SRC / "registry.ts"
    text = read(path)
    text = text.replace(
        "import { Box, Container, Divider, Grid, Stack } from './features/layout/public';",
        "import { Divider, Grid, ScrollView, View } from './features/layout/public';",
    )
    text = text.replace("import { Center, Inline, Show, Spacer } from './foundation';\n", "")
    for name in ["  Box,\n", "  Center,\n", "  Container,\n", "  Inline,\n", "  Show,\n", "  Spacer,\n", "  Stack,\n"]:
        text = text.replace(name, "")
    anchor = "  SectionList,\n"
    if anchor in text:
        text = text.replace(anchor, anchor + "  ScrollView,\n  View,\n", 1)
    write(path, text)


def update_metadata() -> None:
    path = SRC / "metadata" / "componentMeta.ts"
    text = read(path)
    text = text.replace("import { boxMeta } from '../features/layout/boxMeta';\n", "")
    text = text.replace("import { containerMeta } from '../features/layout/containerMeta';\n", "")
    text = text.replace("import { stackMeta } from '../features/layout/stackMeta';\n", "")
    text = text.replace(
        "import { gridMeta } from '../features/layout/gridMeta';\n",
        "import { gridMeta } from '../features/layout/gridMeta';\nimport { scrollViewMeta } from '../features/layout/scrollViewMeta';\nimport { viewMeta } from '../features/layout/viewMeta';\n",
    )
    text = text.replace("import { foundationMetas } from '../foundation/meta';\n", "")
    text = text.replace("  ...foundationMetas,\n", "")
    text = text.replace("  Box: boxMeta,\n  Container: containerMeta,\n  Stack: stackMeta,\n", "  View: viewMeta,\n  ScrollView: scrollViewMeta,\n")
    write(path, text)

    allowed = SRC / "metadata" / "allowedChildren.ts"
    text = read(allowed)
    text = text.replace("  'Box',\n  'Stack',\n", "  'View',\n  'ScrollView',\n")
    text = text.replace("  'Container',\n", "")
    text = text.replace("  'SettingsRow',\n", "")
    write(allowed, text)


def delete_foundation() -> None:
    shutil.rmtree(SRC / "foundation", ignore_errors=True)


def update_package() -> None:
    path = ROOT / "package.json"
    package = json.loads(read(path))
    package["dependencies"]["@ankhorage/surface"] = "^6.0.0"
    write(path, json.dumps(package, indent=2) + "\n")


def main() -> None:
    update_package()
    create_layout_api()

    candidates = [
        path
        for base in [SRC, EXAMPLES]
        if base.exists()
        for path in base.rglob("*")
        if path.suffix in {".ts", ".tsx"}
        and "src/features/layout/adapters/inbound/Box.tsx" not in str(path)
        and "src/features/layout/adapters/inbound/Container.tsx" not in str(path)
        and "src/features/layout/adapters/inbound/Stack.tsx" not in str(path)
    ]
    for path in candidates:
        transform_source(path)

    rewrite_screen()
    update_index()
    update_registry()
    update_metadata()
    delete_foundation()

    # The migration runner is intentionally one-shot and must not remain in the product diff.
    (ROOT / ".github" / "migrate_surface6_layout.py").unlink(missing_ok=True)
    (ROOT / ".github" / "workflows" / "migrate-surface6-layout.yml").unlink(missing_ok=True)


if __name__ == "__main__":
    main()
