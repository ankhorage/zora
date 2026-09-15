from pathlib import Path

path = Path('.github/phase2_layout.py')
text = path.read_text(encoding='utf-8')
old = '''    marker = "export { KeyboardAvoidingView,"
    marker_index = text.index(marker)
    line_end = text.index("\\n", text.index("} from './features/keyboard-avoiding-view/public';", marker_index)) + 1
    text = text[:line_end] + content_export + text[line_end:]
'''
new = '''    text = content_export + text
'''
if old not in text:
    raise SystemExit('phase2 root export marker block not found')
path.write_text(text.replace(old, new), encoding='utf-8')
Path(__file__).unlink()
