import React from 'react';

import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Heading } from '../../components/heading';
import { Image } from '../../components/image';
import { Text } from '../../components/text';
import { Divider, Inline, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';
import type { ProductCardProps } from './types';

function ProductCardInner({
  title,
  subtitle,
  description,
  brand,
  vendor: _vendor,
  imageUrl,
  imageAlt,
  price,
  currency,
  badges,
  meta,
  primaryActionLabel,
  secondaryActionLabel,
  onPress,
  onPrimaryAction,
  onSecondaryAction,
  ...rest
}: ProductCardProps & ZoraBaseProps) {
  const hasHeaderInfo = !!title || !!brand || !!subtitle;
  const hasMeta = !!meta && meta.length > 0;
  const hasActions = !!primaryActionLabel || !!secondaryActionLabel;
  const isInteractive = Boolean(onPress);

  return (
    <Card onPress={isInteractive ? onPress : undefined} {...rest}>
      <Stack gap="m">
        {imageUrl ? (
          <Image
            accessibilityLabel={imageAlt ?? title}
            source={{ uri: imageUrl }}
            aspectRatio={1}
            radius="m"
          />
        ) : null}

        <Stack gap="s">
          {hasHeaderInfo ? (
            <Stack gap="xxs">
              {brand ? (
                <Text variant="caption" weight="semiBold" emphasis="muted">
                  {brand.toUpperCase()}
                </Text>
              ) : null}
              <Heading level={4}>{title}</Heading>
              {subtitle ? (
                <Text variant="bodySmall" emphasis="muted">
                  {subtitle}
                </Text>
              ) : null}
            </Stack>
          ) : null}

          {description ? <Text variant="bodySmall">{description}</Text> : null}

          {badges && badges.length > 0 ? (
            <Inline gap="xs" wrap="wrap">
              {badges.map((badge) => (
                <Badge key={badge}>{badge}</Badge>
              ))}
            </Inline>
          ) : null}
        </Stack>

        {price ? (
          <Text variant="bodySmall" weight="bold">
            {currency ? `${currency} ` : ''}
            {price}
          </Text>
        ) : null}

        {hasMeta ? (
          <Stack gap="xs">
            <Divider />
            {meta.map((item) => (
              <Inline key={item.label} justify="space-between">
                <Text variant="bodySmall" emphasis="muted">
                  {item.label}
                </Text>
                <Text variant="bodySmall" weight="semiBold">
                  {item.value}
                </Text>
              </Inline>
            ))}
          </Stack>
        ) : null}

        {hasActions ? (
          <Stack gap="s">
            <Divider />
            <Inline gap="s">
              {secondaryActionLabel ? (
                <Button variant="ghost" onPress={onSecondaryAction} size="s">
                  {secondaryActionLabel}
                </Button>
              ) : null}
              {primaryActionLabel ? (
                <Button variant="solid" onPress={onPrimaryAction} size="s" flex={1}>
                  {primaryActionLabel}
                </Button>
              ) : null}
            </Inline>
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );
}

export const ProductCard = withZoraThemeScope(ProductCardInner);
