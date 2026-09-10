import * as ImagePicker from 'expo-image-picker';

import type { UploadAsset } from '../../../../types/upload';
import type { UploadPickerInput } from '../../application/ports/outbound/UploadPickerPort';

/*** Picks one image or video through Expo ImagePicker and maps it to the ZORA upload contract. */
export async function pickImageOrVideoAsync(input: UploadPickerInput): Promise<UploadAsset | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: input.type === 'video' ? ['videos'] : ['images'],
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
    fileName: asset.fileName ?? undefined,
    sizeBytes: asset.fileSize,
    contentType: asset.mimeType ?? undefined,
    width: asset.width > 0 ? asset.width : undefined,
    height: asset.height > 0 ? asset.height : undefined,
  };
}
