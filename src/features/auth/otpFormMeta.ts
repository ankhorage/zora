import type { ZoraComponentMeta } from '../authoring';

export const otpFormMeta = {
  name: 'OtpForm',
  category: 'pattern',
  description: 'Collects and verifies a one-time passcode with an optional resend action.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'OTP form',
    defaultProps: {
      length: 6,
      otpLabel: 'Code',
      resendLabel: 'Resend code',
      submitLabel: 'Verify code',
      resendDisabled: false,
      resendLoading: false,
      loading: false,
      disabled: false,
    },
  },
  events: {
    submit: {
      label: 'Submit',
      eventType: 'otpForm.submit',
      payloadFields: [{ path: 'otp', type: 'string', label: 'One-time passcode' }],
    },
    resend: {
      label: 'Resend',
      eventType: 'otpForm.resend',
      payloadFields: [],
    },
  },
  props: {
    length: { type: 'number', category: 'Validation', label: 'Code length', default: 6 },
    otpLabel: { type: 'string', category: 'Content', label: 'Code label' },
    resendLabel: { type: 'string', category: 'Content', label: 'Resend label' },
    submitLabel: { type: 'string', category: 'Content', label: 'Submit label' },
    error: { type: 'string', category: 'State', label: 'Error' },
    resendDisabled: {
      type: 'boolean',
      category: 'State',
      label: 'Resend disabled',
      default: false,
    },
    resendLoading: {
      type: 'boolean',
      category: 'State',
      label: 'Resend loading',
      default: false,
    },
    loading: { type: 'boolean', category: 'State', label: 'Loading', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
  },
} as const satisfies ZoraComponentMeta;
