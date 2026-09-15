import { Modal as SurfaceModal } from '@ankhorage/surface';
import React from 'react';
import { StyleSheet } from 'react-native';

import type { DialogProps } from '../../../../types/dialog';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Heading, Text } from '../../../typography/public';
import { resolveDialogWidth } from '../../utils/resolveDialogWidth';

/*** Renders the product-level dialog composition on top of the Surface modal primitive. */
export const Dialog = withZoraThemeScope(DialogInner);

/*** Connects dialog chrome and slots to the generic modal overlay. */
function DialogInner({
  themeId: _themeId,
  mode: _mode,
  children,
  title,
  description,
  footer,
  width = 'default',
  onDismiss,
  interactionPolicy,
  ...props
}: DialogProps) {
  const hasHeader = title !== undefined || description !== undefined;
  const stableOnDismiss = useStableCallback(onDismiss);

  return (
    <SurfaceModal {...props} onDismiss={stableOnDismiss} interactionPolicy={interactionPolicy}>
      <View maxWidth={resolveDialogWidth(width)} style={styles.content}>
        <View gap="m">
          {hasHeader ? (
            <View gap="xs">
              {title !== undefined ? <Heading level={3}>{title}</Heading> : null}
              {description !== undefined ? (
                <Text emphasis="muted" variant="bodySmall">
                  {description}
                </Text>
              ) : null}
            </View>
          ) : null}
          {children ? <View>{children}</View> : null}
          {footer ? <View pt="xs">{footer}</View> : null}
        </View>
      </View>
    </SurfaceModal>
  );
}

/*** Keeps the dismiss callback identity stable while always invoking the latest handler. */
function useStableCallback(callback: (() => void) | undefined): (() => void) | undefined {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return React.useCallback(() => {
    callbackRef.current?.();
  }, []);
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    width: '100%',
  },
});
