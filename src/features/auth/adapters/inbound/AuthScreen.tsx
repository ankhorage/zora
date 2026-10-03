import React from 'react';
import { Platform } from 'react-native';

import type { AuthScreenProps } from '../../../../types/auth';
import { KeyboardAvoidingView } from '../../../keyboard-avoiding-view/public';
import { Divider, ScrollView, View } from '../../../layout/public';
import { Surface } from '../../../surface/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Text } from '../../../typography/public';
import { OAuthProviderList } from './OAuthProviderList';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

/***
 * Reusable authentication-screen composition for sign-in and sign-up flows.
 *
 * Owns keyboard-safe responsive layout, auth surface presentation, OAuth separation, and
 * sign-in/sign-up form composition while consumers retain routing and authentication orchestration.
 */
export const AuthScreen = withZoraThemeScope(AuthScreenInner);

/*** Render the themed authentication screen while preserving consumer-owned callbacks and state. */
function AuthScreenInner({
  themeId: _themeId,
  mode: _themeMode,
  interactionPolicy,
  authMode,
  title,
  description,
  info,
  error,
  loading = false,
  disabled = false,
  identifiers,
  identifierLabel,
  signUpFields,
  oauthProviders = [],
  oauthSeparatorLabel = 'or continue with password',
  onModeChange,
  onOAuthProviderPress,
  onSignInSubmit,
  onSignUpSubmit,
  testID,
}: AuthScreenProps) {
  const effectiveTitle = title ?? (authMode === 'signIn' ? 'Sign in' : 'Create account');
  const hasOAuth = oauthProviders.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ android: 'height', ios: 'padding' })}
      interactionPolicy={interactionPolicy}
      style={{ flex: 1 }}
    >
      <ScrollView
        bg="background"
        contentContainerStyle={{ flexGrow: 1 }}
        flex={1}
        interactionPolicy={interactionPolicy}
        keyboardShouldPersistTaps="handled"
      >
        <View
          align="center"
          flex={1}
          interactionPolicy={interactionPolicy}
          justify="center"
          px={{ base: 'm', md: 'xl' }}
          py="xl"
        >
          <Surface
            gap="m"
            maxWidth={560}
            p={{ base: 'l', md: 'xl' }}
            radius="l"
            testID={testID}
            variant="outline"
            width="100%"
          >
            <View gap="xs" interactionPolicy={interactionPolicy}>
              <Text variant="lead" weight="semiBold">
                {effectiveTitle}
              </Text>
              {description ? (
                <Text emphasis="muted" variant="bodySmall">
                  {description}
                </Text>
              ) : null}
            </View>

            {hasOAuth ? (
              <>
                <OAuthProviderList
                  disabled={disabled || loading}
                  interactionPolicy={interactionPolicy}
                  onProviderPress={onOAuthProviderPress}
                  providers={oauthProviders}
                  testID={testID ? `${testID}-oauth` : undefined}
                />
                <View align="center" direction="row" gap="s" interactionPolicy={interactionPolicy}>
                  <View flex={1} interactionPolicy={interactionPolicy}>
                    <Divider interactionPolicy={interactionPolicy} />
                  </View>
                  <Text emphasis="muted" variant="bodySmall">
                    {oauthSeparatorLabel}
                  </Text>
                  <View flex={1} interactionPolicy={interactionPolicy}>
                    <Divider interactionPolicy={interactionPolicy} />
                  </View>
                </View>
              </>
            ) : null}

            <AuthScreenForm
              authMode={authMode}
              disabled={disabled}
              error={error}
              identifierLabel={identifierLabel}
              identifiers={identifiers}
              interactionPolicy={interactionPolicy}
              loading={loading}
              onModeChange={onModeChange}
              onSignInSubmit={onSignInSubmit}
              onSignUpSubmit={onSignUpSubmit}
              signUpFields={signUpFields}
              testID={testID ? `${testID}-form` : undefined}
            />

            {info ? (
              <Text color="success" variant="bodySmall">
                {info}
              </Text>
            ) : null}
          </Surface>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type AuthScreenFormProps = Pick<
  AuthScreenProps,
  | 'authMode'
  | 'disabled'
  | 'error'
  | 'identifierLabel'
  | 'identifiers'
  | 'interactionPolicy'
  | 'loading'
  | 'onModeChange'
  | 'onSignInSubmit'
  | 'onSignUpSubmit'
  | 'signUpFields'
  | 'testID'
>;

/*** Render the active ZORA auth form and translate form-switch actions into the shared mode boundary. */
function AuthScreenForm({
  authMode,
  disabled,
  error,
  identifierLabel,
  identifiers,
  interactionPolicy,
  loading,
  onModeChange,
  onSignInSubmit,
  onSignUpSubmit,
  signUpFields,
  testID,
}: AuthScreenFormProps) {
  if (authMode === 'signIn') {
    return (
      <SignInForm
        disabled={disabled}
        error={error}
        identifierLabel={identifierLabel}
        identifiers={identifiers}
        interactionPolicy={interactionPolicy}
        loading={loading}
        onSignUp={onModeChange ? () => onModeChange('signUp') : undefined}
        onSubmit={onSignInSubmit}
        signUpLabel="Need an account? Sign up"
        submitLabel="Sign in"
        testID={testID}
      />
    );
  }

  return (
    <SignUpForm
      disabled={disabled}
      error={error}
      fields={signUpFields}
      interactionPolicy={interactionPolicy}
      loading={loading}
      onSignIn={onModeChange ? () => onModeChange('signIn') : undefined}
      onSubmit={onSignUpSubmit}
      signInLabel="Already have an account? Sign in"
      submitLabel="Create account"
      testID={testID}
    />
  );
}
