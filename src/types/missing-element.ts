import type { ZoraBaseProps } from './base';

export interface MissingElementProps extends ZoraBaseProps {
  requestedCapability: string;
  reason: string;
  evidenceId?: string;
  minimumWidth?: number;
  minimumHeight?: number;
}
