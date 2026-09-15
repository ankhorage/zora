import type {
  AccordionItemProps as SurfaceAccordionItemProps,
  AccordionMode,
  AccordionMultipleProps as SurfaceAccordionMultipleProps,
  AccordionSingleProps as SurfaceAccordionSingleProps,
  ButtonIconSpec,
} from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';

export type { AccordionMode } from '@ankhorage/surface';

export type AccordionSingleProps = ZoraBaseProps &
  Omit<SurfaceAccordionSingleProps, 'children'> & {
    children?: React.ReactNode;
  };

export type AccordionMultipleProps = ZoraBaseProps &
  Omit<SurfaceAccordionMultipleProps, 'children'> & {
    children?: React.ReactNode;
  };

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export type AccordionItemProps = ZoraBaseProps &
  Omit<SurfaceAccordionItemProps, 'children'> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    icon?: ButtonIconSpec;
    actions?: React.ReactNode;
    children?: React.ReactNode;
  };

export interface AccordionPresentationContextValue {
  mode: AccordionMode;
  openValues: readonly string[];
}
