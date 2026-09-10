import { describe, expect, test } from 'bun:test';

import type { UploadPickerPort } from '../ports/outbound/UploadPickerPort';
import { pickUploadAssetAsync } from './pickUploadAssetAsync';

describe('pickUploadAssetAsync', () => {
  test('routes image and video selection to the media picker', async () => {
    const calls: string[] = [];
    const mediaPicker: UploadPickerPort = {
      pickAsync: (input) => {
        calls.push(`media:${input.type}`);
        return Promise.resolve(null);
      },
    };
    const documentPicker: UploadPickerPort = {
      pickAsync: (input) => {
        calls.push(`document:${input.type}`);
        return Promise.resolve(null);
      },
    };

    await pickUploadAssetAsync({ type: 'image' }, mediaPicker, documentPicker);
    await pickUploadAssetAsync({ type: 'video' }, mediaPicker, documentPicker);

    expect(calls).toEqual(['media:image', 'media:video']);
  });

  test('routes document and generic file selection to the document picker', async () => {
    const calls: string[] = [];
    const mediaPicker: UploadPickerPort = {
      pickAsync: (input) => {
        calls.push(`media:${input.type}`);
        return Promise.resolve(null);
      },
    };
    const documentPicker: UploadPickerPort = {
      pickAsync: (input) => {
        calls.push(`document:${input.type}`);
        return Promise.resolve(null);
      },
    };

    await pickUploadAssetAsync({ type: 'document' }, mediaPicker, documentPicker);
    await pickUploadAssetAsync({ type: 'file' }, mediaPicker, documentPicker);

    expect(calls).toEqual(['document:document', 'document:file']);
  });
});
