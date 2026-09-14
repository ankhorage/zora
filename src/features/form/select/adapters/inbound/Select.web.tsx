import { Popover } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../../theme/withZoraThemeScope';
import type { SelectProps } from '../../../../../types/select';
import { Stack } from '../../../../layout/public';
import { Surface } from '../../../../surface/public';
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
  const controller = useSelectController(props);

  const selectAndClose = React.useCallback(
    (value: TValue) => {
      controller.select(value);
      setOpen(false);
    },
    [controller.select],
  );

  return (
    <SelectField props={props}>
      <Popover
        anchor={({ toggle }) => (
          <SelectTrigger
            displayLabel={controller.selectedOption?.label}
            onPress={toggle}
            props={props}
          />
        )}
        interactionPolicy={props.interactionPolicy}
        onOpenChange={setOpen}
        open={open}
        placement="bottom-start"
        testID={props.testID ? `${props.testID}-popover` : undefined}
      >
        <Surface variant="raised">
          <Stack gap="xs" p="xs">
            {props.options.map((option) => (
              <SelectOptionRow
                interactionPolicy={props.interactionPolicy}
                key={option.value}
                onSelect={selectAndClose}
                option={option}
                selected={controller.value === option.value}
                testID={props.testID}
              />
            ))}
          </Stack>
        </Surface>
      </Popover>
    </SelectField>
  );
}
