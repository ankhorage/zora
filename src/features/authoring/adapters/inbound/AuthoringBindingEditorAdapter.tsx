import React from 'react';

import type { AuthoringBindingEditorAdapterProps } from '../../../../types/authoring-adapters';
import { Field } from '../../../form/public';
import { View } from '../../../layout/public';

/*** Presents canonical bindable properties while leaving binding representation and mutation ownership external. */
export function AuthoringBindingEditorAdapter<TNode, TBinding>({
  node,
  component,
  getBinding,
  onBindingChange,
  renderBinding,
  isBindingDisabled,
  isBindingRequired,
  disabled = false,
}: AuthoringBindingEditorAdapterProps<TNode, TBinding>) {
  if (node === null || component === null) return null;
  const bindings = component.bindings?.props;
  if (bindings === undefined) return null;

  return (
    <View gap="m">
      {Object.entries(bindings).map(([name, meta]) => {
        const controlDisabled = disabled || isBindingDisabled?.(node, name) === true;
        const required = isBindingRequired?.(node, name) === true;
        return (
          <Field
            key={name}
            description={meta.description}
            disabled={controlDisabled}
            label={meta.label ?? name}
            required={required}
          >
            {renderBinding({
              node,
              component,
              name,
              label: meta.label ?? name,
              description: meta.description,
              binding: getBinding(node, name),
              disabled: controlDisabled,
              required,
              onChange: (binding) => {
                if (!controlDisabled) onBindingChange?.(node, name, binding);
              },
            })}
          </Field>
        );
      })}
    </View>
  );
}
