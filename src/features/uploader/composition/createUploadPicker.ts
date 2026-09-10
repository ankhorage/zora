import { pickDocumentOrFileAsync } from '../adapters/outbound/pickDocumentOrFileAsync';
import { pickImageOrVideoAsync } from '../adapters/outbound/pickImageOrVideoAsync';
import type { UploadPickerPort } from '../application/ports/outbound/UploadPickerPort';
import { pickUploadAssetAsync } from '../application/use-cases/pickUploadAssetAsync';

/*** Wires the Expo picker adapters into the generic upload picker use case. */
export function createUploadPicker(): UploadPickerPort {
  const imageOrVideoPicker: UploadPickerPort = { pickAsync: pickImageOrVideoAsync };
  const documentOrFilePicker: UploadPickerPort = { pickAsync: pickDocumentOrFileAsync };

  return {
    pickAsync: (input) => pickUploadAssetAsync(input, imageOrVideoPicker, documentOrFilePicker),
  };
}
