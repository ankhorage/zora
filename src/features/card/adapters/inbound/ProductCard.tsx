import React from 'react';

import type { ZoraBaseProps } from '../../../../types/base';
import type { ProductCardProps } from '../../../../types/product-card';
import { Badge } from '../../../badge/public';
import { Button } from '../../../button/public';
import { Image } from '../../../image/public';
import { Divider, View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Heading } from '../../../typography/public';
import { Text } from '../../../typography/public';
import { Card } from '../../public';
export const ProductCard = withZoraThemeScope(ProductCardInner);

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
  interactionPolicy,
  ...rest
}: ProductCardProps & ZoraBaseProps) {
  const hasHeaderInfo = !!title || !!brand || !!subtitle;
  const hasMeta = !!meta && meta.length > 0;
  const hasActions = !!primaryActionLabel || !!secondaryActionLabel;
  const isInteractive = Boolean(onPress);

  const eyebrow = brand ?? _vendor;

  return (
    <Card
      onPress={isInteractive ? onPress : undefined}
      interactionPolicy={interactionPolicy}
      {...rest}
    >
      <View gap="m">
        {imageUrl ? (
          <Image
            accessibilityLabel={imageAlt ?? title}
            source={{ uri: imageUrl }}
            aspectRatio={1}
            radius="m"
          />
        ) : null}

        <View gap="s">
          {hasHeaderInfo ? (
            <View gap="xxs">
              {eyebrow ? (
                <Text variant="caption" weight="semiBold" emphasis="muted">
                  {eyebrow}
                </Text>
              ) : null}
              <Heading level={4}>{title}</Heading>
              {subtitle ? (
                <Text variant="bodySmall" emphasis="muted">
                  {subtitle}
                </Text>
              ) : null}
            </View>
          ) : null}

          {description ? <Text variant="bodySmall">{description}</Text> : null}

          {badges && badges.length > 0 ? (
            <View direction="row" gap="xs" wrap="wrap">
              {badges.map((badge, index) => (
                <Badge key={`${badge}-${index}`}>{badge}</Badge>
              ))}
            </View>
          ) : null}
        </View>

        {price ? (
          <Text variant="bodySmall" weight="bold">
            {currency ? `${currency} ` : ''}
            {price}
          </Text>
        ) : null}

        {hasMeta ? (
          <View gap="xs">
            <Divider />
            {meta.map((item, index) => (
              <View direction="row" key={`${item.label}-${index}`} justify="space-between">
                <Text variant="bodySmall" emphasis="muted">
                  {item.label}
                </Text>
                <Text variant="bodySmall" weight="semiBold">
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {hasActions ? (
          <View gap="s">
            <Divider />
            <View direction="row" gap="s">
              {secondaryActionLabel ? (
                <Button
                  interactionPolicy={interactionPolicy}
                  variant="ghost"
                  onPress={onSecondaryAction}
                  size="s"
                >
                  {secondaryActionLabel}
                </Button>
              ) : null}
              {primaryActionLabel ? (
                <Button
                  interactionPolicy={interactionPolicy}
                  variant="solid"
                  onPress={onPrimaryAction}
                  size="s"
                  flex={1}
                >
                  {primaryActionLabel}
                </Button>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
    </Card>
  );
}
