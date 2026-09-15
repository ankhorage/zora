import { Popover } from '@ankhorage/surface';
import React from 'react';

import type { TimePickerProps } from '../../../../types/time-picker';
import { Surface } from '../../../surface/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { TimePickerContent } from '../../composition/TimePickerContent';
import { TimePickerField } from '../../composition/TimePickerField';
import { TimePickerTrigger } from '../../composition/TimePickerTrigger';

/*** Renders TimePicker with anchored web Popover presentation. */
export const TimePicker = withZoraThemeScope(TimePickerInner);

/*** Connects the shared TimePicker field and content to the web Popover host. */
function TimePickerInner({ themeId: _themeId, mode: _mode, ...props }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <TimePickerField {...props}>
      <Popover
        anchor={({ toggle }) => <TimePickerTrigger {...props} onPress={toggle} />}
        interactionPolicy={props.interactionPolicy}
        onOpenChange={setOpen}
        open={open}
        placement="bottom-start"
        testID={props.testID ? `${props.testID}-popover` : undefined}
      >
        <Surface variant="raised">
          <TimePickerContent
            description={props.description}
            formatTime={props.formatTime}
            interactionPolicy={props.interactionPolicy}
            label={props.label}
            maxTime={props.maxTime}
            minTime={props.minTime}
            onDismiss={() => setOpen(false)}
            onSelect={(time) => {
              props.onValueChange?.(time);
              setOpen(false);
            }}
            stepMinutes={props.stepMinutes}
            testID={props.testID}
            value={props.value}
          />
        </Surface>
      </Popover>
    </TimePickerField>
  );
}
