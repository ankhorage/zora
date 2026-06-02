import { describe, expect, it } from 'bun:test';
import React from 'react';

import { BarcodeScannerView, CameraPermissionView, ScanOverlay } from './index';
import { barcodeScannerViewMeta, cameraPermissionViewMeta, scanOverlayMeta } from './meta';

describe('scanner patterns', () => {
  it('exports scanner primitives', () => {
    expect(typeof BarcodeScannerView).toBe('function');
    expect(typeof CameraPermissionView).toBe('function');
    expect(typeof ScanOverlay).toBe('function');
  });

  it('creates a permission view for denied camera access', () => {
    const element = React.createElement(CameraPermissionView, {
      status: 'denied',
      onRequestPermission: () => undefined,
      onManualEntry: () => undefined,
    });

    expect(element.type).toBe(CameraPermissionView);
    expect(element.props.status).toBe('denied');
    expect(typeof element.props.onManualEntry).toBe('function');
  });

  it('creates an adapter-neutral barcode scanner view', () => {
    const camera = React.createElement('mock-camera', { testID: 'camera-adapter' });
    const element = React.createElement(BarcodeScannerView, {
      permissionStatus: 'granted',
      camera,
      onBarcodeScanned: (result: { value: string }) => result.value,
    });

    expect(element.type).toBe(BarcodeScannerView);
    expect(element.props.permissionStatus).toBe('granted');
    expect(element.props.camera).toBe(camera);
    expect(typeof element.props.onBarcodeScanned).toBe('function');
  });

  it('describes scanner components for metadata-driven tooling', () => {
    expect(barcodeScannerViewMeta.name).toBe('BarcodeScannerView');
    expect(barcodeScannerViewMeta.events.onBarcodeScanned.eventType).toBe('scan');
    expect(cameraPermissionViewMeta.name).toBe('CameraPermissionView');
    expect(scanOverlayMeta.name).toBe('ScanOverlay');
  });
});
