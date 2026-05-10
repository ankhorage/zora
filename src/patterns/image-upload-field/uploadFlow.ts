import type { ZoraImageAsset } from '../image-preview';
import type { ZoraPickedImage } from './types';

function parseAccept(accept: string | undefined): readonly string[] {
  if (!accept) return [];

  return accept
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function matchesAcceptToken({
  token,
  contentType,
  fileName,
}: {
  token: string;
  contentType: string | undefined;
  fileName: string | undefined;
}): boolean | null {
  const normalizedToken = token.toLowerCase();
  const normalizedContentType = contentType?.toLowerCase();
  const normalizedFileName = fileName?.toLowerCase();

  if (normalizedToken.startsWith('.')) {
    if (!normalizedFileName) return null;
    return normalizedFileName.endsWith(normalizedToken);
  }

  if (normalizedToken.endsWith('/*')) {
    if (!normalizedContentType) return null;
    const prefix = normalizedToken.slice(0, Math.max(0, normalizedToken.length - 1));
    return normalizedContentType.startsWith(prefix);
  }

  if (!normalizedContentType) return null;
  return normalizedContentType === normalizedToken;
}

export function isAccepted({
  accept,
  contentType,
  fileName,
}: {
  accept: string | undefined;
  contentType: string | undefined;
  fileName: string | undefined;
}): boolean {
  const tokens = parseAccept(accept);
  if (tokens.length === 0) return true;

  let hadSignal = false;

  for (const token of tokens) {
    const matches = matchesAcceptToken({ token, contentType, fileName });
    if (matches === null) {
      continue;
    }

    hadSignal = true;
    if (matches) return true;
  }

  // If we cannot validate due to missing metadata, do not block.
  return !hadSignal;
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'] as const;
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const unit = units[unitIndex] ?? 'B';
  const rounded = unitIndex === 0 ? Math.round(size) : Math.round(size * 10) / 10;
  return `${rounded} ${unit}`;
}

export function formatAcceptHint(accept: string | undefined): string | null {
  const tokens = parseAccept(accept);
  if (tokens.length === 0) return null;
  return `Accepted: ${tokens.join(', ')}`;
}

export function formatMaxSizeHint(maxSizeBytes: number | undefined): string | null {
  if (maxSizeBytes === undefined) return null;
  if (!Number.isFinite(maxSizeBytes) || maxSizeBytes <= 0) return null;
  return `Max size: ${formatBytes(maxSizeBytes)}`;
}

export function createOptimisticAssetFromPicked(picked: ZoraPickedImage): ZoraImageAsset {
  return {
    kind: 'url',
    url: picked.uri,
    width: picked.width,
    height: picked.height,
    contentType: picked.contentType,
    metadata: {
      fileName: picked.fileName,
      sizeBytes: picked.sizeBytes,
    },
  };
}

export function resolveRenderableUrl(asset: ZoraImageAsset | null): string | null {
  if (!asset) return null;
  if (asset.kind === 'url') return asset.url;
  return asset.publicUrl ?? null;
}

export function validatePickedImage({
  picked,
  accept,
  maxSizeBytes,
  validatePicked,
}: {
  picked: ZoraPickedImage;
  accept: string | undefined;
  maxSizeBytes: number | undefined;
  validatePicked: ((picked: ZoraPickedImage) => string | undefined) | undefined;
}): string | undefined {
  if (!isAccepted({ accept, contentType: picked.contentType, fileName: picked.fileName })) {
    return accept ? `File type not accepted. Expected ${accept}.` : 'File type not accepted.';
  }

  if (
    maxSizeBytes !== undefined &&
    Number.isFinite(maxSizeBytes) &&
    maxSizeBytes > 0 &&
    picked.sizeBytes !== undefined &&
    Number.isFinite(picked.sizeBytes) &&
    picked.sizeBytes > maxSizeBytes
  ) {
    return `File is too large (${formatBytes(picked.sizeBytes)}). Max ${formatBytes(maxSizeBytes)}.`;
  }

  return validatePicked?.(picked);
}
