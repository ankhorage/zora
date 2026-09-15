import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../authoring/componentMeta';

const AUTH_MANIFEST_ELEMENTS = [
  'ForgotPasswordForm',
  'OAuthProviderButton',
  'OAuthProviderList',
  'OtpForm',
  'SignInForm',
  'SignUpForm',
] as const;
const authMetaByName = new Map(Object.entries(ZORA_COMPONENT_META));

test('auth solutions are direct manifest leaf nodes with authoring schemas', () => {
  for (const name of AUTH_MANIFEST_ELEMENTS) {
    const meta = authMetaByName.get(name);
    expect(meta?.directManifestNode, name).toBe(true);
    expect(meta?.allowedChildren, name).toEqual([]);
    expect(Object.keys(meta?.props ?? {}).length, name).toBeGreaterThan(0);
  }
});

test('auth solution events expose their actionable boundaries', () => {
  expect(ZORA_COMPONENT_META.SignInForm?.events?.submit?.payloadFields).toContainEqual({
    path: 'secret',
    type: 'string',
    label: 'Secret',
  });
  expect(ZORA_COMPONENT_META.OtpForm?.events?.resend?.eventType).toBe('otpForm.resend');
  expect(ZORA_COMPONENT_META.OAuthProviderList?.events?.providerPress?.payloadFields).toEqual([
    { path: 'providerId', type: 'string', label: 'Provider ID' },
  ]);
});
