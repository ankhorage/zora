import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface MissingElementProps extends ZoraBaseProps {
  requestedCapability: string;
  reason: string;
  evidenceId?: string;
  minimumWidth?: number;
  minimumHeight?: number;
}
