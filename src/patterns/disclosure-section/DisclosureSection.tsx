import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { IconButton } from '../../components/icon-button';
import { Panel } from '../panel';
import type { DisclosureSectionProps } from './types';

export function DisclosureSection({
  title,
  description,
  icon,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  actions,
  children,
  disabled,
  testID,
}: DisclosureSectionProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const toggleOpen = () => {
    if (disabled) return;

    if (isControlled) {
      onOpenChange?.(!controlledOpen);
    } else {
      setInternalOpen(!internalOpen);
      onOpenChange?.(!internalOpen);
    }
  };

  return (
    <Panel
      compact
      description={description}
      testID={testID}
      title={title}
      eyebrow={icon ? <Box pb="xs">{/* Surface icon spec would go here */}</Box> : null}
      actions={
        <Stack direction="row" gap="xs" align="center">
          {actions}
          <IconButton
            icon={{ name: isOpen ? 'chevron-up-outline' : 'chevron-down-outline' }}
            label={isOpen ? 'Collapse' : 'Expand'}
            emphasis="ghost"
            tone="neutral"
            size="s"
            disabled={disabled}
            onPress={toggleOpen}
          />
        </Stack>
      }
    >
      {isOpen ? <Box pt="m">{children}</Box> : null}
    </Panel>
  );
}
