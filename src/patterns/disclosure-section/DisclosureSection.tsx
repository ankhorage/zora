import React from 'react';
import { Platform, Pressable, type TextStyle, type ViewStyle } from 'react-native';

import { Heading } from '../../components/heading';
import { IconButton } from '../../components/icon-button';
import { Text } from '../../components/text';
import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Panel } from '../panel';
import type { DisclosureSectionProps } from './types';

const triggerTextStyle: ViewStyle = {
  flex: 1,
  flexBasis: 0,
  minWidth: 0,
};

const triggerCopyStyle: TextStyle = {
  flexShrink: 1,
  maxWidth: '100%',
  minWidth: 0,
};

const trailingStyle: ViewStyle = {
  flexShrink: 0,
};

const getTriggerStyle = (disabled?: boolean): ViewStyle =>
  ({
    alignSelf: 'stretch',
    flex: 1,
    flexBasis: 0,
    justifyContent: 'center',
    minWidth: 0,
    ...(Platform.OS === 'web'
      ? {
          cursor: disabled ? 'default' : 'pointer',
        }
      : null),
  }) as ViewStyle;

function DisclosureSectionInner({
  themeId: _themeId,
  mode: _mode,
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
  const titleLabel = typeof title === 'string' || typeof title === 'number' ? `: ${title}` : '';
  const toggleLabel = `${isOpen ? 'Collapse' : 'Expand'} section${titleLabel}`;

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
    <Panel compact testID={testID}>
      <Stack gap="s">
        <Stack direction="row" gap="m" align="center">
          <Pressable
            accessibilityLabel={toggleLabel}
            accessibilityRole="button"
            accessibilityState={{ disabled, expanded: isOpen }}
            disabled={disabled}
            onPress={toggleOpen}
            style={getTriggerStyle(disabled)}
          >
            <Box style={triggerTextStyle}>
              <Stack gap="xs">
                {icon ? <Box pb="xs">{/* Surface icon spec would go here */}</Box> : null}
                <Heading level={4} style={triggerCopyStyle}>
                  {title}
                </Heading>
                {description ? (
                  <Text emphasis="muted" variant="bodySmall" style={triggerCopyStyle}>
                    {description}
                  </Text>
                ) : null}
              </Stack>
            </Box>
          </Pressable>

          {actions ? <Box style={trailingStyle}>{actions}</Box> : null}

          <Box style={trailingStyle}>
            <IconButton
              icon={{ name: isOpen ? 'chevron-up-outline' : 'chevron-down-outline' }}
              label={isOpen ? 'Collapse' : 'Expand'}
              variant="ghost"
              color="neutral"
              size="s"
              disabled={disabled}
              onPress={toggleOpen}
            />
          </Box>
        </Stack>

        {isOpen ? <Box pt="m">{children}</Box> : null}
      </Stack>
    </Panel>
  );
}

/***
 * Expandable section pattern with a summary header and collapsible content.
 *

 */
export const DisclosureSection = withZoraThemeScope(DisclosureSectionInner);
