import { Accordion as SurfaceAccordion } from '@ankhorage/surface';
import React from 'react';

import type {
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
} from '../../../../types/accordion';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { AccordionPresentationContext } from '../../composition/AccordionPresentationContext';

/*** Renders a ZORA accordion backed by Surface expansion and accessibility mechanics. */
export const Accordion = withZoraThemeScope(AccordionInner);

/*** Routes the public accordion union to its single or multiple Surface contract. */
function AccordionInner(props: AccordionProps) {
  if (props.type === 'multiple') {
    return <MultipleAccordion {...props} />;
  }

  return <SingleAccordion {...props} />;
}

/*** Mirrors Surface multiple-value state for ZORA presentation only. */
function MultipleAccordion({
  themeId: _themeId,
  mode: _mode,
  children,
  defaultValue,
  interactionPolicy,
  onValueChange,
  value,
  ...surfaceProps
}: AccordionMultipleProps) {
  const [presentationValues, setPresentationValues] = React.useState<readonly string[]>(
    () => value ?? defaultValue ?? [],
  );
  const openValues = value ?? presentationValues;

  return (
    <AccordionPresentationContext value={{ mode: 'multiple', openValues }}>
      <SurfaceAccordion
        {...surfaceProps}
        defaultValue={defaultValue}
        interactionPolicy={interactionPolicy}
        onValueChange={(nextValues) => {
          setPresentationValues(nextValues);
          onValueChange?.(nextValues);
        }}
        type="multiple"
        value={value}
      >
        {children}
      </SurfaceAccordion>
    </AccordionPresentationContext>
  );
}

/*** Mirrors Surface single-value state for ZORA presentation only. */
function SingleAccordion({
  themeId: _themeId,
  mode: _mode,
  children,
  defaultValue,
  interactionPolicy,
  onValueChange,
  type: _type,
  value,
  ...surfaceProps
}: AccordionSingleProps) {
  const [presentationValue, setPresentationValue] = React.useState<string | undefined>(
    () => value ?? defaultValue,
  );
  const openValue = value ?? presentationValue;
  const openValues = openValue === undefined ? [] : [openValue];

  return (
    <AccordionPresentationContext value={{ mode: 'single', openValues }}>
      <SurfaceAccordion
        {...surfaceProps}
        defaultValue={defaultValue}
        interactionPolicy={interactionPolicy}
        onValueChange={(nextValue) => {
          setPresentationValue(nextValue);
          onValueChange?.(nextValue);
        }}
        type="single"
        value={value}
      >
        {children}
      </SurfaceAccordion>
    </AccordionPresentationContext>
  );
}
