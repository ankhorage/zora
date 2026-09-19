import type { UploadAsset } from '../../../types/upload';
import type {
  UploadPickerInput,
  UploadPickerPort,
} from '../application/ports/outbound/UploadPickerPort';

/*** Creates the browser upload picker without Expo or React Native runtime dependencies. */
export function createUploadPicker(): UploadPickerPort {
  return {
    pickAsync: pickBrowserFileAsync,
  };
}

/*** Opens one transient browser file input and maps the selected File to the portable upload contract. */
function pickBrowserFileAsync(input: UploadPickerInput): Promise<UploadAsset | null> {
  if (typeof document === 'undefined' || typeof URL === 'undefined') {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const picker = document.createElement('input');
    picker.type = 'file';
    picker.multiple = false;
    picker.style.display = 'none';
    if (input.accept !== undefined && input.accept.trim() !== '') {
      picker.accept = input.accept;
    }

    const finish = (asset: UploadAsset | null) => {
      picker.remove();
      resolve(asset);
    };

    picker.addEventListener(
      'change',
      () => {
        const file = picker.files?.item(0);
        finish(file === null || file === undefined ? null : createLocalUploadAsset(file));
      },
      { once: true },
    );
    picker.addEventListener('cancel', () => finish(null), { once: true });
    document.body.append(picker);
    picker.click();
  });
}

/*** Maps one browser File to a local upload asset backed by an object URL. */
function createLocalUploadAsset(file: File): UploadAsset {
  return {
    kind: 'local',
    uri: URL.createObjectURL(file),
    fileName: file.name || undefined,
    sizeBytes: file.size,
    contentType: file.type || undefined,
  };
}
