import { expect, test } from 'bun:test';

import { authScreenMeta } from './authScreenMeta';
import { forgotPasswordFormMeta } from './forgotPasswordFormMeta';
import { oauthProviderButtonMeta } from './oauthProviderButtonMeta';
import { oauthProviderListMeta } from './oauthProviderListMeta';
import { otpFormMeta } from './otpFormMeta';
import { signInFormMeta } from './signInFormMeta';
import { signUpFormMeta } from './signUpFormMeta';

const AUTH_MANIFEST_ELEMENTS = {
  AuthScreen: authScreenMeta,
  ForgotPasswordForm: forgotPasswordFormMeta,
  OAuthProviderButton: oauthProviderButtonMeta,
  OAuthProviderList: oauthProviderListMeta,
  OtpForm: otpFormMeta,
  SignInForm: signInFormMeta,
  SignUpForm: signUpFormMeta,
} as const;

test('auth solutions are direct manifest leaf nodes with authoring schemas', () => {
  for (const [name, meta] of Object.entries(AUTH_MANIFEST_ELEMENTS)) {
    expect(meta.directManifestNode, name).toBe(true);
    expect(meta.allowedChildren, name).toEqual([]);
    expect(Object.keys(meta.props).length, name).toBeGreaterThan(0);
  }
});

test('auth solution events expose their actionable boundaries', () => {
  expect(authScreenMeta.events.modeChange.eventType).toBe('authScreen.modeChange');
  expect(authScreenMeta.events.oauthProviderPress.payloadFields).toEqual([
    { path: 'providerId', type: 'string', label: 'Provider ID' },
  ]);
  expect(signInFormMeta.events.submit.payloadFields).toContainEqual({
    path: 'secret',
    type: 'string',
    label: 'Secret',
  });
  expect(otpFormMeta.events.resend.eventType).toBe('otpForm.resend');
  expect(oauthProviderListMeta.events.providerPress.payloadFields).toEqual([
    { path: 'providerId', type: 'string', label: 'Provider ID' },
  ]);
});
