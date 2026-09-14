import {
  AccordionContent as SurfaceAccordionContent,
  AccordionItem as SurfaceAccordionItem,
  AccordionTrigger as SurfaceAccordionTrigger,
} from '@ankhorage/surface';
import React from 'react';
import type { ViewStyle } from 'react-native';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { AccordionItemProps } from '../../../../types/accordion';
import { Icon } from '../../../icon/public';
import { Box, Divider, Stack } from '../../../layout/public';
import { Heading, Text } from '../../../typography/public';
import { AccordionPresentationContext } from '../../composition/AccordionPresentationContext';

/*** Renders one opinionated ZORA accordion item over Surface trigger/content primitives. */
export const AccordionItem = withZoraThemeScope(AccordionItemInner);

const triggerStyle: ViewStyle = { flex: 1 };

/*** Composes the item header, optional actions, expanded content, and separator. */
function AccordionItemInner({
  themeId: _themeId,
  mode: _mode,
  actions,
  children,
  description,
  disabled,
  icon,
  interactionPolicy,
  testID,
  title,
  value,
  ...surfaceItemProps
}: AccordionItemProps) {
  const presentation = React.use(AccordionPresentationContext);
  if (!presentation) {
    throw new Error('AccordionItem must be rendered inside Accordion.');
  }

  const open = presentation.openValues.includes(value);

  return (
    <SurfaceAccordionItem
      {...surfaceItemProps}
      disabled={disabled}
      interactionPolicy={interactionPolicy}
      testID={testID}
      value={value}
    >
      <Stack gap="none">
        <Stack align="center" direction="row" gap="s">
          <Box flex={1}>
            <SurfaceAccordionTrigger interactionPolicy={interactionPolicy} style={triggerStyle}>
              <Box px="m" py="m">
                <Stack align="center" direction="row" gap="m">
                  {icon ? <Icon {...icon} /> : null}
                  <Box flex={1}>
                    <Stack gap="xs">
                      <Heading level={4}>{title}</Heading>
                      {description ? (
                        <Text emphasis="muted" variant="bodySmall">
                          {description}
                        </Text>
                      ) : null}
                    </Stack>
                  </Box>
                  <Icon name={open ? 'chevron-up-outline' : 'chevron-down-outline'} size="m" />
                </Stack>
              </Box>
            </SurfaceAccordionTrigger>
          </Box>
          {actions ? <Box pr="m">{actions}</Box> : null}
        </Stack>

        <SurfaceAccordionContent>
          <Box px="m" pb="m">
            <Stack gap="m">{children}</Stack>
          </Box>
        </SurfaceAccordionContent>

        <Divider />
      </Stack>
    </SurfaceAccordionItem>
  );
}
