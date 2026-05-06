import React from 'react';

import { Button } from '../../components/button';
import { Modal } from '../../components/modal';
import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ConfirmDialogProps } from './types';

function ConfirmDialogInner({
  themeId: _themeId,
  mode: _mode,
  visible,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmTone = 'danger',
  confirmEmphasis = 'solid',
  busy = false,
  closeOnBackdrop = true,
  onConfirm,
  onCancel,
  testID,
}: ConfirmDialogProps) {
  return (
    <Modal
      closeOnBackdrop={closeOnBackdrop}
      description={description}
      footer={
        <Stack direction={{ base: 'column', md: 'row' }} gap="s" justify="flex-end">
          <Button emphasis="soft" onPress={onCancel} tone="neutral">
            {cancelLabel}
          </Button>
          <Button emphasis={confirmEmphasis} loading={busy} onPress={onConfirm} tone={confirmTone}>
            {confirmLabel}
          </Button>
        </Stack>
      }
      onDismiss={onCancel}
      testID={testID}
      title={title}
      visible={visible}
      width="narrow"
    >
      {children}
    </Modal>
  );
}

export const ConfirmDialog = withZoraThemeScope(ConfirmDialogInner);
