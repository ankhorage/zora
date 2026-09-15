import {
  AccordionContent as SurfaceAccordionContent,
  AccordionItem as SurfaceAccordionItem,
  AccordionTrigger as SurfaceAccordionTrigger,
} from '@ankhorage/surface';
import React from 'react';
import type { ViewStyle } from 'react-native';

import type { AccordionItemProps } from '../../../../types/accordion';
import { Icon } from '../../../icon/public';
import { Divider, View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
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
      <View gap="none">
        <View align="center" direction="row" gap="s">
          <View flex={1}>
            <SurfaceAccordionTrigger interactionPolicy={interactionPolicy} style={triggerStyle}>
              <View px="m" py="m">
                <View align="center" direction="row" gap="m">
                  {icon ? <Icon {...icon} /> : null}
                  <View flex={1}>
                    <View gap="xs">
                      <Heading level={4}>{title}</Heading>
                      {description ? (
                        <Text emphasis="muted" variant="bodySmall">
                          {description}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <Icon name={open ? 'chevron-up-outline' : 'chevron-down-outline'} size="m" />
                </View>
              </View>
            </SurfaceAccordionTrigger>
          </View>
          {actions ? <View pr="m">{actions}</View> : null}
        </View>

        <SurfaceAccordionContent>
          <View px="m" pb="m">
            <View gap="m">{children}</View>
          </View>
        </SurfaceAccordionContent>

        <Divider />
      </View>
    </SurfaceAccordionItem>
  );
}
