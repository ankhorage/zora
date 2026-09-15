import { Popover } from '@ankhorage/surface';
import React from 'react';

import type { SelectProps } from '../../../../../types/select';
import { View } from '../../../../layout/public';
import { Surface } from '../../../../surface/public';
import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';
import { SelectField } from '../../composition/SelectField';
import { SelectOptionRow } from '../../composition/SelectOptionRow';
import { SelectTrigger } from '../../composition/SelectTrigger';
import { useSelectController } from '../../composition/useSelectController';

/*** Renders Select with anchored Popover presentation on web. */
export const Select = withZoraThemeScope(SelectInner);

/*** Connects shared Select state and controls to the web Popover host. */
function SelectInner<TValue extends string = string>({
  themeId: _themeId,
  mode: _mode,
  ...props
}: SelectProps<TValue>) {
  const [open, setOpen] = React.useState(false);
  const { select, selectedOption, value } = useSelectController(props);
  const { interactionPolicy, options, testID } = props;

  const selectAndClose = React.useCallback(
    (nextValue: TValue) => {
      select(nextValue);
      setOpen(false);
    },
    [select],
  );

  return (
    <SelectField props={props}>
      <Popover
        anchor={({ toggle }) => (
          <SelectTrigger displayLabel={selectedOption?.label} onPress={toggle} props={props} />
        )}
        interactionPolicy={props.interactionPolicy}
        onOpenChange={setOpen}
        open={open}
        placement="bottom-start"
        testID={testID ? `${testID}-popover` : undefined}
      >
        <Surface variant="raised">
          <View gap="xs" p="xs">
            {options.map((option) => (
              <SelectOptionRow
                interactionPolicy={interactionPolicy}
                key={option.value}
                onSelect={selectAndClose}
                option={option}
                selected={value === option.value}
                testID={testID}
              />
            ))}
          </View>
        </Surface>
      </Popover>
    </SelectField>
  );
}
