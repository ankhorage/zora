import { Stack } from '@ankhorage/surface';
import React from 'react';

import { Button } from '../../components/button';
import { Modal } from '../../components/modal';
import type { ConfirmDialogProps } from './types';

export function ConfirmDialog({
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
