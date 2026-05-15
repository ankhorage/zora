---
'@ankhorage/zora': major
---

**BREAKING:** Replace `ZoraTone` / `tone` semantic color API with `ZoraColor` / `color` everywhere.

### What changed

- Removed the exported `ZoraTone` type.
- All public `tone` props that select a semantic color role are now `color` props typed as `ZoraColor`.
- Added exported types: `ZoraColor`, `ZoraPaletteColor`, `ZoraStatusColor` from `@ankhorage/zora`.
- Renamed exported types: `TextTone` → `TextColor`, `HeadingTone` → `HeadingColor`.
- `ZoraColor` covers: `primary`, `secondary`, `tertiary`, `quaternary`, `neutral`, `success`, `warning`, `error`, `info`, `danger`.

### Migration guide

Replace all `tone` props with `color` on ZORA components that accept a semantic color role:

```diff
- <Button tone="primary" />
+ <Button color="primary" />

- <Badge tone="success" />
+ <Badge color="success" />

- <Text tone="muted" />
+ <Text color="muted" />

- <Heading tone="primary" />
+ <Heading color="primary" />

- <Notice tone="primary" />
+ <Notice color="primary" />

- <Progress tone="primary" />
+ <Progress color="primary" />

- <Rating tone="warning" />
+ <Rating color="warning" />

- <Chip tone="primary" />
+ <Chip color="primary" />

- <ChipGroup tone="primary" />
+ <ChipGroup color="primary" />

- <CheckboxGroup tone="primary" />
+ <CheckboxGroup color="primary" />

- <RadioGroup tone="primary" />
+ <RadioGroup color="primary" />

- <IconButton tone="neutral" />
+ <IconButton color="neutral" />

- <ConfirmDialog confirmTone="danger" />
+ <ConfirmDialog confirmColor="danger" />

- <MetricCard deltaTone="neutral" />
+ <MetricCard deltaColor="neutral" />
```

Replace renamed types:

```diff
- import type { ZoraTone, TextTone, HeadingTone } from '@ankhorage/zora';
+ import type { ZoraColor, TextColor, HeadingColor } from '@ankhorage/zora';
```

Note: `Card`, `MediaCard`, `PostCard`, `Toolbar` and other layout components still use `tone` for their **visual card variant** (`ZoraCardTone`). Only props that select a **semantic color role** were renamed.
