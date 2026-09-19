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

/*** Opens one transient browser file input and maps the selected file to the portable upload contract. */
function pickBrowserFileAsync(input: UploadPickerInput): Promise<UploadAsset | null> {
  const browser = globalThis as unknown as BrowserRuntime;
  const { document, URL: urlApi } = browser;
  const body = document?.body;
  if (document === undefined || body === undefined || urlApi === undefined) {
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

    /*** Completes one browser picker request and removes its transient input. */
    const finish = (asset: UploadAsset | null) => {
      picker.remove();
      resolve(asset);
    };

    picker.addEventListener(
      'change',
      () => {
        const selectedFile = picker.files?.item(0);
        finish(
          selectedFile === null || selectedFile === undefined
            ? null
            : createLocalUploadAsset(selectedFile, urlApi),
        );
      },
      { once: true },
    );
    picker.addEventListener('cancel', () => finish(null), { once: true });
    body.append(picker);
    picker.click();
  });
}

/*** Maps one browser file to a local upload asset backed by an object URL. */
function createLocalUploadAsset(file: BrowserFile, urlApi: BrowserUrlApi): UploadAsset {
  return {
    kind: 'local',
    uri: urlApi.createObjectURL(file),
    fileName: file.name || undefined,
    sizeBytes: file.size,
    contentType: file.type || undefined,
  };
}

interface BrowserRuntime {
  readonly document?: BrowserDocument;
  readonly URL?: BrowserUrlApi;
}

interface BrowserDocument {
  readonly body?: {
    append(node: BrowserFileInput): void;
  };
  createElement(tagName: 'input'): BrowserFileInput;
}

interface BrowserFileInput {
  accept: string;
  readonly files?: BrowserFileList | null;
  multiple: boolean;
  readonly style: {
    display: string;
  };
  type: string;
  addEventListener(type: string, listener: () => void, options?: { readonly once?: boolean }): void;
  click(): void;
  remove(): void;
}

interface BrowserFileList {
  item(index: number): BrowserFile | null;
}

interface BrowserFile {
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

interface BrowserUrlApi {
  createObjectURL(file: BrowserFile): string;
}
