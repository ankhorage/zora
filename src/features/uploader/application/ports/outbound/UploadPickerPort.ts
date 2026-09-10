import type { UploadAsset, UploadType } from '../../../../../types/upload';

export interface UploadPickerInput {
  type: UploadType;
  accept?: string;
}

export interface UploadPickerPort {
  pickAsync: (input: UploadPickerInput) => Promise<UploadAsset | null>;
}
