import type { ZoraComponentMeta } from '../../metadata';

const AUTH_NOTE = 'Auth pattern component; not represented as a manifest node in v1.';

export const forgotPasswordFormMeta = {
  name: 'ForgotPasswordForm',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: AUTH_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const oauthProviderButtonMeta = {
  name: 'OAuthProviderButton',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: AUTH_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const oauthProviderListMeta = {
  name: 'OAuthProviderList',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: AUTH_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const otpFormMeta = {
  name: 'OtpForm',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: AUTH_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const signInFormMeta = {
  name: 'SignInForm',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: AUTH_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const signUpFormMeta = {
  name: 'SignUpForm',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: AUTH_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;
