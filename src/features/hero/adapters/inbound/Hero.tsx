import React from 'react';

import type { HeroAction, HeroAlign, HeroProps } from '../../../../types/hero';
import { Button } from '../../../button/public';
import { Card } from '../../../card/public';
import { Grid, View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Heading, Text } from '../../../typography/public';

function HeroInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  title,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  media,
  footer,
  align = 'start',
  layout = 'split',
  tone = 'subtle',
  compact = false,
  testID,
}: HeroProps) {
  const hasActions = primaryAction !== undefined || secondaryAction !== undefined;
  const hasMedia = media !== undefined;
  const contentAlign = resolveContentAlign(align);
  const textAlign = align === 'center' ? 'center' : undefined;
  const mediaFirst = layout === 'mediaFirst';

  const content = (
    <View width="100%">
      <View align={contentAlign} gap={compact ? 's' : 'm'}>
        <View align={contentAlign} gap="xs">
          {eyebrow !== undefined ? (
            <Text align={textAlign} color="primary" variant="eyebrow">
              {eyebrow}
            </Text>
          ) : null}
          <Heading
            align={textAlign}
            level={1}
            size={{ base: 'h2', md: compact ? 'h2' : 'display' }}
          >
            {title}
          </Heading>
          {description !== undefined ? (
            <Text
              align={textAlign}
              emphasis="muted"
              variant={{ base: 'body', md: compact ? 'body' : 'lead' }}
            >
              {description}
            </Text>
          ) : null}
        </View>

        {hasActions ? (
          <View
            align={contentAlign}
            direction={{ base: 'column', md: 'row' }}
            gap="s"
            justify={align === 'center' ? 'center' : 'flex-start'}
          >
            {primaryAction !== undefined
              ? renderAction(primaryAction, 'primary', interactionPolicy)
              : null}
            {secondaryAction !== undefined
              ? renderAction(secondaryAction, 'secondary', interactionPolicy)
              : null}
          </View>
        ) : null}

        {footer}
      </View>
    </View>
  );

  const mediaSlot = hasMedia ? <View width="100%">{media}</View> : null;

  const body =
    hasMedia && layout !== 'stack' ? (
      <Grid cols={{ base: 1, md: 2 }} gap={compact ? 'm' : 'l'}>
        {mediaFirst ? mediaSlot : content}
        {mediaFirst ? content : mediaSlot}
      </Grid>
    ) : (
      <View align="center" direction="column" gap={compact ? 'm' : 'l'}>
        {mediaFirst ? mediaSlot : content}
        {mediaFirst ? content : mediaSlot}
      </View>
    );

  return (
    <Card compact={compact} interactionPolicy={interactionPolicy} testID={testID} tone={tone}>
      {body}
    </Card>
  );
}

function renderAction(
  action: HeroAction,
  role: 'primary' | 'secondary',
  interactionPolicy: HeroProps['interactionPolicy'],
) {
  return (
    <Button
      disabled={action.disabled}
      interactionPolicy={interactionPolicy}
      variant={action.variant ?? (role === 'primary' ? 'solid' : 'soft')}
      onPress={action.onPress}
      color={action.color ?? (role === 'primary' ? 'primary' : 'neutral')}
    >
      {action.label}
    </Button>
  );
}

function resolveContentAlign(align: HeroAlign) {
  return align === 'center' ? 'center' : 'flex-start';
}

/***
 * Hero section pattern for prominent page introductions with actions.
 *
 
 */
export const Hero = withZoraThemeScope(HeroInner);
