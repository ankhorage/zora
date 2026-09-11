import React from 'react';

import { Modal } from '../../../../components/modal';
import { FormField } from '../../../../patterns/form-field';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { UploadAsset, UploaderProps, UploadType } from '../../../../types/upload';
import { Button } from '../../../button/public';
import { Icon } from '../../../icon/public';
import { Image } from '../../../image/public';
import { Box, Stack } from '../../../layout/public';
import { Progress } from '../../../progress/public';
import { Text } from '../../../typography/public';
import { validateUploadAsset } from '../../application/use-cases/validateUploadAsset';
import { createUploadPicker } from '../../composition/createUploadPicker';

/*** Picks, validates, uploads, previews, and removes one generic file asset. */
export const Uploader = withZoraThemeScope(UploaderInner);

/*** Owns the interactive state for the generic uploader inbound adapter. */
function UploaderInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  value = null,
  onChange,
  onValueChange,
  onUploadRequest,
  onRemoveRequest,
  onValidationError,
  uploadState = 'idle',
  uploadProgress,
  label = 'File',
  description,
  helperText,
  errorText,
  type = 'file',
  accept,
  maxSizeBytes,
  required,
  disabled = false,
  readOnly = false,
  validatePicked,
  onUpload,
  onRemove,
  aspectRatio = 1,
  interactionPolicy,
}: UploaderProps) {
  const passive = interactionPolicy === 'passive';
  const picker = React.useMemo(() => createUploadPicker(), []);
  const [internalError, setInternalError] = React.useState<string | undefined>();
  const [internalUploading, setUploading] = React.useState(false);
  const [internalRemoving, setRemoving] = React.useState(false);
  const uploading = internalUploading || uploadState === 'uploading';
  const removing = internalRemoving || uploadState === 'removing';
  const [progress, setProgress] = React.useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const mountedRef = React.useRef<boolean | null>(null);
  const resolvedAccept = resolveUploadAccept(type, accept);
  const actionsDisabled = disabled || readOnly;
  const effectiveError = errorText ?? internalError;
  const notifyValue = React.useCallback(
    (next: UploadAsset | null) => {
      onChange?.(next);
      onValueChange?.(next);
    },
    [onChange, onValueChange],
  );

  React.useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const isMounted = React.useCallback(() => mountedRef.current === true, []);

  const setProgressSafe = React.useCallback(
    (next: number | null) => {
      if (!isMounted()) {
        return;
      }

      setProgress(clampProgress(next));
    },
    [isMounted],
  );

  const handlePick = React.useCallback(async () => {
    if (passive || actionsDisabled || uploading || removing) {
      return;
    }

    setInternalError(undefined);

    try {
      const picked = await picker.pickAsync({ accept: resolvedAccept, type });
      if (!picked || !isMounted()) {
        return;
      }

      const validationError = validateUploadAsset({
        accept: resolvedAccept,
        asset: picked,
        maxSizeBytes,
        validate: validatePicked,
      });
      if (validationError) {
        setInternalError(validationError);
        onValidationError?.({ message: validationError });
        return;
      }

      notifyValue(picked);
      onUploadRequest?.({ asset: picked });
      if (!onUpload) {
        return;
      }

      setUploading(true);
      setProgressSafe(0);

      try {
        const uploaded = await onUpload(picked, { setProgress: setProgressSafe });
        if (!isMounted()) {
          return;
        }

        notifyValue(uploaded);
        setUploading(false);
        setProgress(null);
      } catch (error) {
        if (!isMounted()) {
          return;
        }

        setInternalError(formatUnknownError(error));
        setUploading(false);
        setProgress(null);
      }
    } catch (error) {
      if (isMounted()) {
        setInternalError(formatUnknownError(error));
      }
    }
  }, [
    actionsDisabled,
    isMounted,
    maxSizeBytes,
    notifyValue,
    onUploadRequest,
    onValidationError,
    onUpload,
    passive,
    picker,
    removing,
    resolvedAccept,
    setProgressSafe,
    type,
    uploading,
    validatePicked,
  ]);

  const handleRemove = React.useCallback(async () => {
    if (passive || actionsDisabled || uploading || removing || !value) {
      return;
    }

    setInternalError(undefined);
    if (onRemoveRequest) {
      onRemoveRequest({ asset: value });
      return;
    }
    if (!onRemove) {
      notifyValue(null);
      return;
    }

    setRemoving(true);
    try {
      await onRemove(value);
      if (isMounted()) {
        notifyValue(null);
        setRemoving(false);
      }
    } catch (error) {
      if (isMounted()) {
        setInternalError(formatUnknownError(error));
        setRemoving(false);
      }
    }
  }, [
    actionsDisabled,
    isMounted,
    notifyValue,
    onRemove,
    onRemoveRequest,
    passive,
    removing,
    uploading,
    value,
  ]);

  const canPreviewImage = type === 'image' && resolveRenderableAssetUrl(value) !== null;

  return (
    <>
      <FormField
        description={description}
        disabled={disabled}
        errorText={effectiveError}
        helperText={helperText}
        interactionPolicy={interactionPolicy}
        invalid={Boolean(effectiveError)}
        label={label}
        readOnly={readOnly}
        required={required}
        testID={testID}
      >
        <Stack gap="m">
          <UploadPresentation asset={value} aspectRatio={aspectRatio} type={type} />

          {resolvedAccept || maxSizeBytes ? (
            <Stack gap="xs">
              {resolvedAccept ? (
                <Text emphasis="muted" variant="caption">
                  Accepted: {resolvedAccept}
                </Text>
              ) : null}
              {maxSizeBytes ? (
                <Text emphasis="muted" variant="caption">
                  Max size: {formatBytes(maxSizeBytes)}
                </Text>
              ) : null}
            </Stack>
          ) : null}

          {uploading ? (
            <Stack gap="xs">
              <Text emphasis="muted" variant="caption">
                Uploading…
              </Text>
              {uploadProgress !== undefined || progress !== null ? (
                <Progress max={1} value={clampProgress(uploadProgress ?? progress) ?? 0} />
              ) : null}
            </Stack>
          ) : null}

          <Stack direction={{ base: 'column', md: 'row' }} gap="s">
            <Button
              disabled={actionsDisabled || uploading || removing}
              interactionPolicy={interactionPolicy}
              onPress={() => {
                void handlePick();
              }}
            >
              {value ? 'Replace file' : 'Select file'}
            </Button>

            {value ? (
              <Button
                color="danger"
                disabled={actionsDisabled || uploading || removing}
                interactionPolicy={interactionPolicy}
                loading={removing}
                variant="outline"
                onPress={() => {
                  void handleRemove();
                }}
              >
                Remove
              </Button>
            ) : null}

            {canPreviewImage ? (
              <Button
                color="neutral"
                interactionPolicy={interactionPolicy}
                variant="soft"
                onPress={() => setPreviewOpen(true)}
              >
                Preview
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </FormField>

      {canPreviewImage ? (
        <Modal
          closeOnBackdrop
          interactionPolicy={interactionPolicy}
          onDismiss={() => setPreviewOpen(false)}
          title="Image preview"
          visible={previewOpen}
        >
          <Stack gap="m">
            <Image aspectRatio={aspectRatio} fit="contain" source={value} />
            <Stack direction="row" justify="flex-end">
              <Button
                color="neutral"
                interactionPolicy={interactionPolicy}
                variant="soft"
                onPress={() => setPreviewOpen(false)}
              >
                Close
              </Button>
            </Stack>
          </Stack>
        </Modal>
      ) : null}
    </>
  );
}

/*** Renders image previews or generic file metadata without exposing picker-specific assets. */
function UploadPresentation({
  asset,
  aspectRatio,
  type,
}: {
  asset: UploadAsset | null;
  aspectRatio: number;
  type: UploadType;
}) {
  if (type === 'image') {
    return <Image aspectRatio={aspectRatio} source={asset} />;
  }

  return (
    <Box borderWidth={1} p="m" radius="m">
      <Stack direction="row" gap="s">
        <Icon name={resolveUploadIcon(type)} size={22} />
        <Stack gap="xs">
          <Text variant="label" weight="semiBold">
            {asset?.fileName ?? 'No file selected'}
          </Text>
          {asset?.contentType ? (
            <Text emphasis="muted" variant="caption">
              {asset.contentType}
            </Text>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

/*** Resolves the native picker default while allowing accept to remain the precise restriction. */
function resolveUploadAccept(type: UploadType, accept: string | undefined): string | undefined {
  if (accept) {
    return accept;
  }

  if (type === 'image') {
    return 'image/*';
  }

  if (type === 'video') {
    return 'video/*';
  }

  return undefined;
}

/*** Resolves an upload asset URL when it can be rendered directly. */
function resolveRenderableAssetUrl(asset: UploadAsset | null): string | null {
  if (!asset) {
    return null;
  }

  switch (asset.kind) {
    case 'local':
      return asset.uri;
    case 'url':
      return asset.url;
    case 'storage':
      return asset.publicUrl ?? null;
  }
}

/*** Resolves a generic icon for the selected upload mode. */
function resolveUploadIcon(
  type: UploadType,
): 'attach-outline' | 'document-text-outline' | 'videocam-outline' {
  switch (type) {
    case 'video':
      return 'videocam-outline';
    case 'document':
      return 'document-text-outline';
    case 'file':
    case 'image':
      return 'attach-outline';
  }
}

/*** Clamps progress callbacks into the normalized 0..1 range. */
function clampProgress(value: number | null): number | null {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.min(1, value));
}

/*** Converts unknown picker/upload failures into user-facing text. */
function formatUnknownError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return 'Something went wrong.';
}

/*** Formats an upload byte limit for concise helper text. */
function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'] as const;
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const unit = units.at(unitIndex) ?? 'B';
  const rounded = unitIndex === 0 ? Math.round(size) : Math.round(size * 10) / 10;
  return `${rounded} ${unit}`;
}
