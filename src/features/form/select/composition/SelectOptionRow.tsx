import { Pressable } from '@ankhorage/surface';

import type { SelectOption, SelectProps } from '../../../../types/select';
import { Button } from '../../../button/public';
import { Icon } from '../../../icon/public';
import { Image } from '../../../image/public';
import { View } from '../../../layout/public';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';

const SELECTED_ICON = { name: 'checkmark' } as const;

/*** Renders one Select option with shared web/native selection semantics. */
export function SelectOptionRow<TValue extends string>({
  interactionPolicy,
  onSelect,
  option,
  selected,
  testID,
}: SelectOptionRowProps<TValue>) {
  const { theme } = useZoraTheme();

  if (option.leadingMedia) {
    return (
      <Pressable
        accessibilityLabel={option.label}
        disabled={option.disabled}
        interactionPolicy={interactionPolicy}
        onPress={() => onSelect(option.value)}
        style={{ alignSelf: 'stretch' }}
        testID={testID ? `${testID}-option-${option.value}` : undefined}
      >
        <View
          align="center"
          bg={selected ? theme.semantics.action.primary.softBg : 'transparent'}
          direction="row"
          gap="s"
          minHeight={44}
          px="m"
          radius="m"
        >
          <Image alt="" height={28} radius="s" source={option.leadingMedia} width={28} />
          <View flex={1}>
            <Text color={selected ? 'primary' : undefined} numberOfLines={1} variant="label">
              {option.label}
            </Text>
          </View>
          {selected ? (
            <Icon color={theme.semantics.action.primary.base} name="checkmark" size={18} />
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <Button
      color={selected ? 'primary' : 'neutral'}
      disabled={option.disabled}
      fullWidth
      interactionPolicy={interactionPolicy}
      onPress={() => onSelect(option.value)}
      testID={testID ? `${testID}-option-${option.value}` : undefined}
      trailingIcon={selected ? SELECTED_ICON : undefined}
      variant={selected ? 'soft' : 'ghost'}
    >
      {option.label}
    </Button>
  );
}

interface SelectOptionRowProps<TValue extends string> {
  interactionPolicy: SelectProps<TValue>['interactionPolicy'];
  onSelect: (value: TValue) => void;
  option: SelectOption<TValue>;
  selected: boolean;
  testID: string | undefined;
}
