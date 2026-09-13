---
'@ankhorage/zora': major
---

Replace the config-driven `Form` API with compositional `Form`, `FormField`, and `FormError` manifest nodes under canonical feature ownership.

`Form` now accepts `FormField` and global `FormError` children instead of `fields`, `values`, `onChange`, `errors`, `error`, and `footer`. Compose each control explicitly inside a `FormField`, keep field errors on `FormField.errorText`, and place global submission errors directly inside `Form`. The submit callback no longer receives values; controlled field state remains owned by the consumer.

Email rules now use the shared `@ankhorage/utility/regex` validation semantics.
