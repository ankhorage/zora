import * as DocumentPicker from 'expo-document-picker';

import type { UploadAsset } from '../../../../types/upload';
import type { UploadPickerInput } from '../../application/ports/outbound/UploadPickerPort';

/*** Picks one document through Expo DocumentPicker and maps it to the ZORA upload contract. */
export async function pickDocumentOrFileAsync(
  input: UploadPickerInput,
): Promise<UploadAsset | null> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
    type: resolveDocumentMimeTypes(input.accept),
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets.at(0);
  if (!asset) {
    return null;
  }

  return {
    kind: 'local',
    uri: asset.uri,
    fileName: asset.name,
    sizeBytes: asset.size,
    contentType: asset.mimeType,
  };
}

function resolveDocumentMimeTypes(accept: string | undefined): string | string[] {
  if (!accept) {
    return '*/*';
  }

  const mimeTypes = accept
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.includes('/'));

  if (mimeTypes.length === 0) {
    return '*/*';
  }

  return mimeTypes.length === 1 ? (mimeTypes.at(0) ?? '*/*') : mimeTypes;
}
