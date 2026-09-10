import type { UploadAsset } from '../../../../types/upload';
import type { UploadPickerInput, UploadPickerPort } from '../ports/outbound/UploadPickerPort';

/*** Selects the appropriate picker capability for the requested upload type. */
export async function pickUploadAssetAsync(
  input: UploadPickerInput,
  imageOrVideoPicker: UploadPickerPort,
  documentOrFilePicker: UploadPickerPort,
): Promise<UploadAsset | null> {
  const picker =
    input.type === 'image' || input.type === 'video' ? imageOrVideoPicker : documentOrFilePicker;

  return picker.pickAsync(input);
}
