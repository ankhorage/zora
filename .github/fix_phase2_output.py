from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src'

REACT_NATIVE_IMPORT_RE = re.compile(
    r"import\s*\{(?P<body>.*?)\}\s*from\s*['\"]react-native['\"];",
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
    normalize_skeleton_types()
    Path(__file__).unlink()


if __name__ == '__main__':
    main()
