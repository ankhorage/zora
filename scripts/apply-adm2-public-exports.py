from pathlib import Path


def replace_once(path: str, old: str, new: str, label: str) -> None:
    file_path = Path(path)
    text = file_path.read_text()
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected one match, found {count}')
    file_path.write_text(text.replace(old, new, 1))


replace_once(
    'src/index.ts',
    '''  ZoraComponentPropArrayItemSchema,
  ZoraComponentPropSchema,
  ZoraComponentPropType,
  ZoraComponentPropValue,
  ZoraComponentSlotMeta,
} from './metadata';
export { ZORA_BINDABLE_COMPONENT_META, ZORA_COMPONENT_META } from './metadata';
''',
    '''  ZoraComponentPropArrayItemSchema,
  ZoraComponentPropAuthoring,
  ZoraComponentPropSchema,
  ZoraComponentPropType,
  ZoraComponentPropValue,
  ZoraComponentSlotMeta,
  ZoraThemeRecipeBooleanFieldMeta,
  ZoraThemeRecipeChoiceFieldMeta,
  ZoraThemeRecipeFieldMeta,
  ZoraThemeRecipeKind,
  ZoraThemeRecipeMeta,
  ZoraThemeRecipeMetaRegistry,
  ZoraThemeRecipeTokenFieldMeta,
  ZoraThemeTokenFamily,
} from './metadata';
export {
  ZORA_BINDABLE_COMPONENT_META,
  ZORA_COMPONENT_META,
  ZORA_THEME_RECIPE_META,
  ZORA_THEME_TOKEN_FAMILIES,
} from './metadata';
''',
    'root metadata exports',
)

replace_once(
    'src/metadata/authoringMeta.test.ts',
    "    expect(authoring('Image', 'resizeMode')).toBeUndefined();",
    "    expect(authoring('Progress', 'value')).toBeUndefined();",
    'absent authoring metadata expectation',
)
