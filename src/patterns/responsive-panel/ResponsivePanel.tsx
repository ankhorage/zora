import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Drawer } from '../../components/drawer';
import { Modal } from '../../components/modal';
import type { ZoraContentWidth } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Panel } from '../panel';
import type { ResponsivePanelProps, ResponsivePanelScroll, ResponsivePanelSize } from './types';

function resolvePanelWidth(size: ResponsivePanelSize): number {
  switch (size) {
    case 'compact':
      return 300;
    case 'wide':
      return 420;
    case 'extraWide':
      return 560;
    case 'default':
    default:
      return 360;
  }
}

function resolveModalWidth(size: ResponsivePanelSize | undefined): ZoraContentWidth | undefined {
  switch (size) {
    case 'compact':
      return 'narrow';
    case 'wide':
    case 'extraWide':
      return 'wide';
    case 'default':
      return 'default';
    default:
      return undefined;
  }
}

function renderPanelBody(children: React.ReactNode, scroll: ResponsivePanelScroll) {
  if (children == null) return null;

  if (scroll === 'content') {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
        style={styles.scrollBody}
      >
        {children}
      </ScrollView>
    );
  }

  return children;
}

function ResponsivePanelInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  actions,
  footer,
  children,
  open,
  onOpenChange,
  side = 'right',
  desktopMode = 'inline',
  mobileMode = 'drawer',
  compact = true,
  size,
  scroll = 'none',
  testID,
}: ResponsivePanelProps) {
  if (!open) return null;

  const body = renderPanelBody(children, scroll);

  // For now, we assume desktopMode determines the rendering.
  // In a real app, this would react to window size.
  if (desktopMode === 'floating') {
    if (mobileMode === 'modal') {
      const modalWidth = resolveModalWidth(size);

      return (
        <Modal
          description={description}
          footer={footer}
          onDismiss={() => onOpenChange(false)}
          testID={testID}
          title={title}
          visible={open}
          width={modalWidth}
        >
          {body}
        </Modal>
      );
    }

    return (
      <Drawer
        description={description}
        footer={footer}
        onDismiss={() => onOpenChange(false)}
        position={side}
        testID={testID}
        title={title}
        visible={open}
      >
        {body}
      </Drawer>
    );
  }

  const panel = (
    <Panel
      actions={actions}
      compact={compact}
      description={description}
      footer={footer}
      testID={testID}
      title={title}
    >
      {body}
    </Panel>
  );

  if (size === undefined) return panel;

  return <View style={[styles.inlineSizedPanel, { width: resolvePanelWidth(size) }]}>{panel}</View>;
}

const styles = StyleSheet.create({
  inlineSizedPanel: {
    maxWidth: '100%',
  },
  scrollBody: {
    flexGrow: 0,
    maxHeight: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
});

/***
 * Adaptive secondary surface that can render as an inline panel, drawer, or modal.
 *
 * Use `ResponsivePanel` for tool panes and admin/detail flows that need the same
 * content to work across compact mobile screens and wider desktop layouts.
 *
 * @readme
 * @example Scrollable wide panel
 * ```tsx
 * <ResponsivePanel open title="APIs" size="wide" scroll="content">...</ResponsivePanel>
 * ```
 */
export const ResponsivePanel = withZoraThemeScope(ResponsivePanelInner);
