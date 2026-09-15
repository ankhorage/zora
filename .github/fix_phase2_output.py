from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src'
PROGRESS_RING = SRC / 'features' / 'progress' / 'adapters' / 'inbound' / 'ProgressRing.tsx'

REACT_NATIVE_IMPORT_RE = re.compile(
    r"import\s*\{(?P<body>[^}]*)\}\s*from\s*['\"]react-native['\"];",
    re.DOTALL,
)
LAYOUT_VIEW_IMPORT_RE = re.compile(
    r"import\s*\{[^}]*\bView\b[^}]*\}\s*from\s*['\"][^'\"]*layout/public['\"];",
    re.DOTALL,
)


def render_named_import(specifiers: list[str], module: str) -> str:
    if not specifiers:
        return ''
    if len(specifiers) == 1:
        return f"import {{ {specifiers[0]} }} from '{module}';"
    return "import {\n  " + ",\n  ".join(specifiers) + f",\n}} from '{module}';"


def remove_native_view_collision(path: Path) -> None:
    if path == PROGRESS_RING:
        return

    text = path.read_text(encoding='utf-8')
    if not LAYOUT_VIEW_IMPORT_RE.search(text):
        return

    def replace(match: re.Match[str]) -> str:
        specifiers = [part.strip() for part in match.group('body').replace('\n', ' ').split(',') if part.strip()]
        specifiers = [specifier for specifier in specifiers if specifier != 'View']
        return render_named_import(specifiers, 'react-native')

    updated = REACT_NATIVE_IMPORT_RE.sub(replace, text)
    if updated != text:
        path.write_text(updated, encoding='utf-8')


def preserve_progress_ring_native_views() -> None:
    text = PROGRESS_RING.read_text(encoding='utf-8')
    text = text.replace(
        "import { StyleSheet, View } from 'react-native';",
        "import { StyleSheet, View as ReactNativeView } from 'react-native';",
    )
    text = text.replace(
        "    <View\n      accessibilityLabel={accessibilityLabel}",
        "    <ReactNativeView\n      accessibilityLabel={accessibilityLabel}",
        1,
    )
    text = text.replace(
        "      <View\n        importantForAccessibility=\"no-hide-descendants\"\n        pointerEvents=\"none\"\n        style={styles.visual}",
        "      <ReactNativeView\n        importantForAccessibility=\"no-hide-descendants\"\n        pointerEvents=\"none\"\n        style={styles.visual}",
        1,
    )
    text = text.replace(
        "      </View>\n\n      {centerValue !== undefined || centerLabel !== undefined ? (",
        "      </ReactNativeView>\n\n      {centerValue !== undefined || centerLabel !== undefined ? (",
        1,
    )
    text = text.replace(
        "        <View\n          importantForAccessibility=\"no-hide-descendants\"\n          pointerEvents=\"none\"\n          style={styles.center}",
        "        <ReactNativeView\n          importantForAccessibility=\"no-hide-descendants\"\n          pointerEvents=\"none\"\n          style={styles.center}",
        1,
    )
    text = text.replace(
        "          </View>\n        </View>\n      ) : null}\n    </View>",
        "          </View>\n        </ReactNativeView>\n      ) : null}\n    </ReactNativeView>",
        1,
    )
    PROGRESS_RING.write_text(text, encoding='utf-8')


def normalize_skeleton_types() -> None:
    path = SRC / 'types' / 'skeleton.ts'
    text = path.read_text(encoding='utf-8')
    text = text.replace(
        "import type { ViewProps, ViewProps } from '../features/layout/public';",
        "import type { ViewProps } from '../features/layout/public';",
    )
    path.write_text(text, encoding='utf-8')


def main() -> None:
    for path in SRC.rglob('*.tsx'):
        remove_native_view_collision(path)
    preserve_progress_ring_native_views()
    normalize_skeleton_types()
    Path(__file__).unlink()


if __name__ == '__main__':
    main()
