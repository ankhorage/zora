import React from 'react';

import { Button } from '../../components/button';
import { Modal } from '../../components/modal';
import { Progress } from '../../components/progress';
import { Text } from '../../components/text';
import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { FormField } from '../form-field';
import { ImagePreview } from '../image-preview';
import type { ImageUploadFieldProps } from './types';
import {
  createOptimisticAssetFromPicked,
  formatAcceptHint,
  formatMaxSizeHint,
  resolveRenderableUrl,
  validatePickedImage,
} from './uploadFlow';

function clampProgress(value: number | null): number | null {
  if (value === null) return null;
  if (!Number.isFinite(value)) return null;
  return Math.max(0, Math.min(1, value));
}

function formatUnknownError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim().length > 0) return error;
  return 'Something went wrong.';
}

function ImageUploadFieldInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  value,
  onChange,
  label,
  description,
  helperText,
  errorText,
  required,
  disabled = false,
  readOnly = false,
  accept,
  maxSizeBytes,
  validatePicked,
  onPick,
  onUpload,
  onRemove,
  aspectRatio = 1,
  previewTitle = 'Image preview',
  previewDescription,
}: ImageUploadFieldProps) {
  const [internalError, setInternalError] = React.useState<string | undefined>(undefined);
  const [uploading, setUploading] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const renderableUrl = resolveRenderableUrl(value);
  const isRenderable = renderableUrl !== null;
  const actionsDisabled = disabled || readOnly;

  const effectiveError = errorText ?? internalError;
  const invalid = Boolean(effectiveError);

  const acceptHint = formatAcceptHint(accept);
  const maxSizeHint = formatMaxSizeHint(maxSizeBytes);

  const setProgressSafe = React.useCallback((next: number | null) => {
    if (!isMountedRef.current) return;
    setProgress(clampProgress(next));
  }, []);

  const clearTransientState = React.useCallback(() => {
    if (!isMountedRef.current) return;
    setUploading(false);
    setRemoving(false);
    setProgress(null);
  }, []);

  const handleReplace = React.useCallback(async () => {
    if (actionsDisabled || uploading || removing) return;

    setInternalError(undefined);
    let picked;
    try {
      picked = await onPick();
    } catch (error) {
      if (!isMountedRef.current) return;
      setInternalError(formatUnknownError(error));
      return;
    }
    if (!picked) return;

    const validationError = validatePickedImage({
      picked,
      accept,
      maxSizeBytes,
      validatePicked,
    });

    if (validationError) {
      setInternalError(validationError);
      return;
    }

    if (!onUpload) {
      onChange(createOptimisticAssetFromPicked(picked));
      return;
    }

    const optimisticAsset = createOptimisticAssetFromPicked(picked);
    onChange(optimisticAsset);
    setUploading(true);
    setProgressSafe(0);

    try {
      const uploaded = await onUpload(picked, { setProgress: setProgressSafe });
      if (!isMountedRef.current) return;
      onChange(uploaded);
      setInternalError(undefined);
      clearTransientState();
    } catch (error) {
      if (!isMountedRef.current) return;
      setInternalError(formatUnknownError(error));
      setUploading(false);
      setProgress(null);
    }
  }, [
    accept,
    actionsDisabled,
    clearTransientState,
    maxSizeBytes,
    onChange,
    onPick,
    onUpload,
    removing,
    setProgressSafe,
    uploading,
    validatePicked,
  ]);

  const handleRemove = React.useCallback(async () => {
    if (actionsDisabled || uploading || removing) return;
    if (!value) {
      onChange(null);
      return;
    }

    setInternalError(undefined);

    if (!onRemove) {
      onChange(null);
      return;
    }

    setRemoving(true);
    try {
      await onRemove(value);
      if (!isMountedRef.current) return;
      onChange(null);
      setRemoving(false);
    } catch (error) {
      if (!isMountedRef.current) return;
      setInternalError(formatUnknownError(error));
      setRemoving(false);
    }
  }, [actionsDisabled, onChange, onRemove, removing, uploading, value]);

  const handlePreview = React.useCallback(() => {
    if (!isRenderable) return;
    setPreviewOpen(true);
  }, [isRenderable]);

  const closePreview = React.useCallback(() => setPreviewOpen(false), []);

  return (
    <>
      <FormField
        description={description}
        disabled={disabled}
        errorText={effectiveError}
        helperText={helperText}
        invalid={invalid}
        label={label}
        readOnly={readOnly}
        required={required}
        testID={testID}
      >
        <Stack gap="m">
          <ImagePreview
            aspectRatio={aspectRatio}
            asset={value}
            emptyDescription={actionsDisabled ? 'No image available.' : undefined}
          />

          {acceptHint || maxSizeHint ? (
            <Stack gap="xs">
              {acceptHint ? (
                <Text emphasis="muted" variant="caption">
                  {acceptHint}
                </Text>
              ) : null}
              {maxSizeHint ? (
                <Text emphasis="muted" variant="caption">
                  {maxSizeHint}
                </Text>
              ) : null}
            </Stack>
          ) : null}

          {uploading ? (
            <Stack gap="xs">
              <Text emphasis="muted" variant="caption">
                Uploading…
              </Text>
              {progress !== null ? <Progress max={1} value={progress} /> : null}
            </Stack>
          ) : null}

          <Stack direction={{ base: 'column', md: 'row' }} gap="s">
            <Button
              disabled={actionsDisabled || uploading || removing}
              onPress={() => {
                void handleReplace();
              }}
            >
              {value ? 'Replace image' : 'Select image'}
            </Button>

            {value ? (
              <Button
                disabled={actionsDisabled || uploading || removing}
                variant="outline"
                loading={removing}
                color="danger"
                onPress={() => {
                  void handleRemove();
                }}
              >
                Remove
              </Button>
            ) : null}

            {isRenderable ? (
              <Button disabled={false} variant="soft" color="neutral" onPress={handlePreview}>
                Preview
              </Button>
            ) : null}
          </Stack>

          {!isRenderable && value?.kind === 'storage' && value.publicUrl === undefined ? (
            <Box>
              <Text emphasis="muted" variant="caption">
                This image is stored, but no preview URL is available yet.
              </Text>
            </Box>
          ) : null}
        </Stack>
      </FormField>

      {isRenderable ? (
        <Modal
          closeOnBackdrop
          description={previewDescription}
          title={previewTitle}
          visible={previewOpen}
          onDismiss={closePreview}
        >
          <Stack gap="m">
            <ImagePreview asset={value} aspectRatio={aspectRatio} />
            <Stack direction="row" justify="flex-end">
              <Button variant="soft" color="neutral" onPress={closePreview}>
                Close
              </Button>
            </Stack>
          </Stack>
        </Modal>
      ) : null}
    </>
  );
}

/***
 * Form field pattern for picking, previewing, and uploading an image.
 *
 * @readme
 */
export const ImageUploadField = withZoraThemeScope(ImageUploadFieldInner);
