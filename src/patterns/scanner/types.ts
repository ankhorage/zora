import type React from 'react';
import type { ButtonProps } from '../../components/button';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type CameraPermissionStatus = 'unknown' | 'requesting' | 'granted' | 'denied';

export interface BarcodeScanResult {
  value: string;
  type?: string;
}

export interface ScanOverlayProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  cornerLabel?: React.ReactNode;
}

export interface CameraPermissionViewProps extends ZoraBaseProps {
  status: Exclude<CameraPermissionStatus, 'granted'>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  requestLabel?: React.ReactNode;
  deniedLabel?: React.ReactNode;
  manualEntryLabel?: React.ReactNode;
  onRequestPermission?: () => void | Promise<void>;
  onManualEntry?: () => void | Promise<void>;
  requestButtonProps?: Omit<ButtonProps, 'children' | 'onPress'>;
  manualEntryButtonProps?: Omit<ButtonProps, 'children' | 'onPress'>;
}

export interface BarcodeScannerViewProps extends ZoraBaseProps {
  permissionStatus: CameraPermissionStatus;
  camera?: React.ReactNode;
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  overlayTitle?: React.ReactNode;
  overlayDescription?: React.ReactNode;
  cornerLabel?: React.ReactNode;
  requestPermissionLabel?: React.ReactNode;
  deniedPermissionLabel?: React.ReactNode;
  manualEntryLabel?: React.ReactNode;
  onRequestPermission?: () => void | Promise<void>;
  onManualEntry?: () => void | Promise<void>;
  onBarcodeScanned?: (result: BarcodeScanResult) => void | Promise<void>;
}
