import React from 'react';

import { Button } from '../../features/button/public';
import { Dialog } from '../../features/dialog/public';
import { View } from '../../features/layout/public';
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
  confirmColor = 'danger',
  confirmVariant = 'solid',
  busy = false,
  closeOnBackdrop = true,
  onConfirm,
  onCancel,
  testID,
  interactionPolicy,
}: ConfirmDialogProps) {
  return (
    <Dialog
      closeOnBackdrop={closeOnBackdrop}
      description={description}
      interactionPolicy={interactionPolicy}
      footer={
        <View direction={{ base: 'column', md: 'row' }} gap="s" justify="flex-end">
          <Button
            variant="soft"
            interactionPolicy={interactionPolicy}
            onPress={onCancel}
            color="neutral"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            loading={busy}
            interactionPolicy={interactionPolicy}
            onPress={onConfirm}
            color={confirmColor}
          >
            {confirmLabel}
          </Button>
        </View>
      }
      onDismiss={onCancel}
      testID={testID}
      title={title}
      visible={visible}
      width="narrow"
    >
      {children}
    </Dialog>
  );
}

/***
 * Confirmation dialog pattern with cancel/confirm actions.
 *
 
 */
export const ConfirmDialog = withZoraThemeScope(ConfirmDialogInner);
