import React from 'react';

import { Drawer } from '../../components/drawer';
import { Modal } from '../../components/modal';
import { Panel } from '../panel';
import type { ResponsivePanelProps } from './types';

export function ResponsivePanel({
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
  testID,
}: ResponsivePanelProps) {
  if (!open) return null;

  // For now, we assume desktopMode determines the rendering.
  // In a real app, this would react to window size.
  if (desktopMode === 'floating') {
    if (mobileMode === 'modal') {
      return (
        <Modal
          description={description}
          footer={footer}
          onDismiss={() => onOpenChange(false)}
          testID={testID}
          title={title}
          visible={open}
        >
          {children}
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
        {children}
      </Drawer>
    );
  }

  // default: inline -> Panel
  return (
    <Panel
      actions={actions}
      compact={compact}
      description={description}
      footer={footer}
      testID={testID}
      title={title}
    >
      {children}
    </Panel>
  );
}
