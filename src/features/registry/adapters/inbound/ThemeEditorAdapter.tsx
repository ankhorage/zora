import React from 'react';

import type { ThemeEditorAdapterProps } from '../../../../types/authoring-adapters';
import { Card } from '../../../card/public';
import { Field } from '../../../form/public';
import { View } from '../../../layout/public';
import { ZORA_THEME_RECIPE_META } from '../../themeRecipeMeta';

/*** Presents ZORA recipe fields without taking ownership of a consumer's theme document. */
export function ThemeEditorAdapter<TTheme>({
  theme,
  recipes = ZORA_THEME_RECIPE_META,
  getRecipeFieldValue,
  onRecipeFieldChange,
  renderField,
  isFieldDisabled,
  isFieldRequired,
  disabled = false,
}: ThemeEditorAdapterProps<TTheme>) {
  if (theme === null) return null;

  return (
    <View gap="m">
      {Object.entries(recipes).map(([recipeName, recipe]) => (
        <Card key={recipeName} description={recipe.description} title={recipe.name}>
          <View gap="m">
            {Object.entries(recipe.fields).map(([fieldName, field]) => {
              const controlDisabled =
                disabled || isFieldDisabled?.(theme, recipeName, fieldName) === true;
              const required = isFieldRequired?.(theme, recipeName, fieldName) === true;
              return (
                <Field
                  key={fieldName}
                  description={field.description}
                  disabled={controlDisabled}
                  label={field.label}
                  required={required}
                >
                  {renderField({
                    theme,
                    recipeName,
                    fieldName,
                    field,
                    value: getRecipeFieldValue(theme, recipeName, fieldName),
                    disabled: controlDisabled,
                    required,
                    onChange: (value) => {
                      if (!controlDisabled) {
                        onRecipeFieldChange?.(theme, recipeName, fieldName, value);
                      }
                    },
                  })}
                </Field>
              );
            })}
          </View>
        </Card>
      ))}
    </View>
  );
}
