import { formatBytes } from '@ankhorage/utility/number';

import type { ValidateUploadAssetInput } from '../../../../types/upload';

/*** Validates a picked upload asset against MIME, extension, size, and caller rules. */
export function validateUploadAsset({
  asset,
  accept,
  maxSizeBytes,
  validate,
}: ValidateUploadAssetInput): string | undefined {
  if (!isAccepted(asset.contentType, asset.fileName, accept)) {
    return accept ? `File type not accepted. Expected ${accept}.` : 'File type not accepted.';
  }

  if (
    maxSizeBytes !== undefined &&
    Number.isFinite(maxSizeBytes) &&
    maxSizeBytes > 0 &&
    asset.sizeBytes !== undefined &&
    Number.isFinite(asset.sizeBytes) &&
    asset.sizeBytes > maxSizeBytes
  ) {
    return `File is too large (${formatBytes(asset.sizeBytes)}). Max ${formatBytes(maxSizeBytes)}.`;
  }

  return validate?.(asset);
}

/*** Returns whether available file metadata satisfies at least one accept token. */
function isAccepted(
  contentType: string | undefined,
  fileName: string | undefined,
  accept: string | undefined,
): boolean {
  const tokens = parseAccept(accept);
  if (tokens.length === 0) {
    return true;
  }

  let hadSignal = false;

  for (const token of tokens) {
    const matches = matchesAcceptToken(token, contentType, fileName);
    if (matches === null) {
      continue;
    }

    hadSignal = true;
    if (matches) {
      return true;
    }
  }

  return !hadSignal;
}

/*** Matches one MIME or extension accept token against available file metadata. */
function matchesAcceptToken(
  token: string,
  contentType: string | undefined,
  fileName: string | undefined,
): boolean | null {
  const normalizedToken = token.toLowerCase();
  const normalizedContentType = contentType?.toLowerCase();
  const normalizedFileName = fileName?.toLowerCase();

  if (normalizedToken.startsWith('.')) {
    return normalizedFileName ? normalizedFileName.endsWith(normalizedToken) : null;
  }

  if (normalizedToken.endsWith('/*')) {
    if (!normalizedContentType) {
      return null;
    }

    return normalizedContentType.startsWith(normalizedToken.slice(0, -1));
  }

  return normalizedContentType ? normalizedContentType === normalizedToken : null;
}

/*** Parses a browser-style accept string into normalized non-empty tokens. */
function parseAccept(accept: string | undefined): readonly string[] {
  if (!accept) {
    return [];
  }

  return accept
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}
