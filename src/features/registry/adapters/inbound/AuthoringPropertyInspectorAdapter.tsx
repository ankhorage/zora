import React from 'react';

import type { AuthoringPropertyInspectorAdapterProps } from '../../../../types/authoring-adapters';
import { Field } from '../../../form/public';
import { View } from '../../../layout/public';

/*** Presents canonical component properties while keeping node storage and mutations with the consumer. */
export function AuthoringPropertyInspectorAdapter<TNode>({
  node,
  component,
  getPropertyValue,
  onPropertyChange,
  renderProperty,
  isPropertyDisabled,
  isPropertyRequired,
  disabled = false,
}: AuthoringPropertyInspectorAdapterProps<TNode>) {
  if (node === null || component === null) return null;

  return (
    <View gap="m">
      {Object.entries(component.props).map(([name, schema]) => {
        const controlDisabled = disabled || isPropertyDisabled?.(node, name, schema) === true;
        const required = isPropertyRequired?.(node, name, schema) === true;
        return (
          <Field
            key={name}
            description={schema.label === undefined ? undefined : schema.category}
            disabled={controlDisabled}
            label={schema.label ?? name}
            required={required}
          >
            {renderProperty({
              node,
              component,
              name,
              schema,
              value: getPropertyValue(node, name),
              disabled: controlDisabled,
              required,
              onChange: (value) => {
                if (!controlDisabled) onPropertyChange?.(node, name, value);
              },
            })}
          </Field>
        );
      })}
    </View>
  );
}
