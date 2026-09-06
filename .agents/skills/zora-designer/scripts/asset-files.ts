import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

/*** Require a portable asset destination without traversal or ambiguous separators. */
export function assertAssetPath(value: string, prefix: string): void {
  if (
    !value.startsWith(prefix) ||
    value.split('/').some((part) => !part || part === '.' || part === '..') ||
    /[\\:]/u.test(value) ||
    [...value].some((character) => character.charCodeAt(0) < 32)
  ) {
    throw new Error(`Asset path must be a portable file below ${prefix}: ${value}`);
  }
}

/*** Read a nonempty regular source file confined to the asset bundle directory. */
export async function readAssetFile(root: string, path: string): Promise<Buffer> {
  assertAssetPath(path, 'assets/');
  const base = await realpath(root);
  const source = await realpath(resolve(root, path));
  if (!source.startsWith(`${base}${sep}`) || !(await stat(source)).isFile()) {
    throw new Error(`Asset source must be a regular file inside the bundle: ${path}`);
  }
  const bytes = await readFile(source);
  if (bytes.length === 0) throw new Error(`Asset file is empty: ${path}`);
  return bytes;
}

/*** Check image signatures and require standalone vector markup for SVG icons. */
export function assertImageContent(bytes: Buffer, contentType: string): void {
  const text = bytes.toString('utf8');
  const signatures: Partial<Record<string, boolean>> = {
    'image/png': bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a',
    'image/jpeg': bytes.subarray(0, 3).toString('hex') === 'ffd8ff',
    'image/webp':
      bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP',
    'image/svg+xml':
      /<svg\b[^>]*\bviewBox=["'][^"']+["']/u.test(text) &&
      /<\/svg>\s*$/u.test(text) &&
      !/<(?:image|script|foreignObject)\b|<!DOCTYPE|data:image|\b(?:href|onload)\s*=/iu.test(text),
  };
  if (signatures[contentType] !== true) {
    throw new Error(`Asset bytes do not match a supported standalone image: ${contentType}`);
  }
}
