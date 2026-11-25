import { Pressable } from '@ankhorage/surface';

import type { SelectProps } from '../../../../types/select';
import { Button } from '../../../button/public';
import { Icon } from '../../../icon/public';
import { Image } from '../../../image/public';
import { View } from '../../../layout/public';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';

const SELECT_CHEVRON_ICON = { name: 'chevron-down' } as const;

/*** Renders the shared Select trigger with the resolved option label or placeholder. */
export function SelectTrigger<TValue extends string>({
  displayLabel,
  leadingMedia,
  onPress,
  props,
}: SelectTriggerProps<TValue>) {
  const { theme } = useZoraTheme();
  const media = leadingMedia ?? props.leadingMedia;

  if (media) {
    return (
      <Pressable
        accessibilityLabel={displayLabel ?? props.placeholder ?? 'Select'}
        disabled={props.disabled}
        interactionPolicy={props.interactionPolicy}
        onPress={props.readOnly ? undefined : onPress}
        style={{ alignSelf: 'stretch' }}
        testID={props.testID ? `${props.testID}-trigger` : undefined}
      >
        <View
          align="center"
          bg={props.invalid ? theme.semantics.error.softBg : theme.semantics.neutral.surface}
          borderColor={props.invalid ? theme.semantics.error.base : theme.semantics.neutral.divider}
          borderWidth={1}
          direction="row"
          gap="s"
          minHeight={44}
          px="m"
          radius="m"
        >
          <Image alt="" height={28} radius="s" source={media} width={28} />
          <View flex={1}>
            <Text
              emphasis={displayLabel ? 'default' : 'muted'}
              numberOfLines={1}
              variant="label"
              weight={props.labelWeight ?? 'semiBold'}
            >
              {displayLabel ?? props.placeholder ?? 'Select'}
            </Text>
          </View>
          <Icon name="chevron-down" size={18} />
        </View>
      </Pressable>
    );
  }

  return (
    <Button
      color={props.invalid ? 'danger' : 'neutral'}
      disabled={props.disabled}
      fullWidth
      interactionPolicy={props.interactionPolicy}
      leadingIcon={props.leadingIcon}
      labelWeight={props.labelWeight ?? 'semiBold'}
      onPress={props.readOnly ? undefined : onPress}
      testID={props.testID ? `${props.testID}-trigger` : undefined}
      trailingIcon={SELECT_CHEVRON_ICON}
      variant="outline"
    >
      {displayLabel ?? props.placeholder ?? 'Select'}
    </Button>
  );
}

interface SelectTriggerProps<TValue extends string> {
  displayLabel: string | undefined;
  leadingMedia: SelectProps<TValue>['leadingMedia'];
  onPress: () => void;
  props: SelectProps<TValue>;
}
