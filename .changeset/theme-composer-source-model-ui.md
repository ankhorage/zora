---
'@ankhorage/zora': patch
---

ThemeComposer now edits the full ZoraTheme source model.

- ThemeComposer adds name editing with empty-name validation.
- ThemeComposer adds app category editing via a Select using APP_CATEGORIES from @ankhorage/contracts.
- ThemeComposer supports optional `appCategories` prop for narrowing the category options list.
- ThemeComposer validates primary color input with parseHexColorOrThrow from @ankhorage/color-theory while keeping public `primaryColor` as `string`.
- ThemeComposer preview shows name, appCategory, primaryColor, and harmony metadata.
- README and examples app updated to reflect the new API.
