---
'@ankhorage/zora': minor
---

Move the complete Auth solution and Gradient to canonical feature ownership.

ForgotPasswordForm, OtpForm, SignInForm, SignUpForm, OAuthProviderButton, OAuthProviderList, and Gradient are now direct manifest nodes with serializable authoring metadata. Gradient remains renderer-agnostic through GradientRendererProvider.
