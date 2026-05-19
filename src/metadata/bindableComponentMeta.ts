import type { UiComponentMetaRegistry } from '@ankhorage/contracts';

export const ZORA_BINDABLE_COMPONENT_META = {
  Text: {
    name: 'Text',
    category: 'component',
    description: 'Displays app-facing text content.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        text: {
          label: 'Text',
          description: 'Text content rendered by the component.',
          value: { type: 'string' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
    },
    props: {
      text: {
        type: 'string',
        category: 'Content',
        label: 'Text',
      },
    },
  },
  Heading: {
    name: 'Heading',
    category: 'component',
    description: 'Displays semantic heading text.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        text: {
          label: 'Text',
          description: 'Heading text rendered by the component.',
          value: { type: 'string' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
    },
    props: {
      text: {
        type: 'string',
        category: 'Content',
        label: 'Text',
      },
    },
  },
  Button: {
    name: 'Button',
    category: 'component',
    description: 'Runs an action when pressed.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        children: {
          label: 'Label',
          description: 'Button label text.',
          value: { type: 'string' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
        disabled: {
          label: 'Disabled',
          description: 'Whether the button is disabled.',
          value: { type: 'boolean' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
      events: {
        press: {
          label: 'Press',
          description: 'Runs when the button is pressed.',
          payload: {
            eventType: 'button.press',
            fields: [],
          },
        },
      },
    },
    events: {
      press: {
        label: 'Press',
        eventType: 'button.press',
        description: 'Emitted when the button action runs.',
        payloadFields: [],
      },
    },
    props: {
      children: {
        type: 'string',
        category: 'Content',
        label: 'Label',
      },
      disabled: {
        type: 'boolean',
        category: 'State',
        label: 'Disabled',
      },
    },
  },
  Image: {
    name: 'Image',
    category: 'component',
    description: 'Displays an image asset or remote image source.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        source: {
          label: 'Source',
          description: 'Image source or asset descriptor.',
          value: {
            type: 'imageAsset',
            fields: [
              { path: 'uri', type: 'string', label: 'URI' },
              { path: 'width', type: 'number', label: 'Width' },
              { path: 'height', type: 'number', label: 'Height' },
              { path: 'alt', type: 'string', label: 'Alt text' },
            ],
          },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
    },
    props: {
      source: {
        type: 'imageAsset',
        category: 'Content',
        label: 'Source',
      },
    },
  },
  Input: {
    name: 'Input',
    category: 'component',
    description: 'Captures a single-line string value.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        value: {
          label: 'Value',
          description: 'Current input value.',
          value: { type: 'string' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
        disabled: {
          label: 'Disabled',
          description: 'Whether the input is disabled.',
          value: { type: 'boolean' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
      events: {
        changeText: {
          label: 'Change text',
          description: 'Runs when the input value changes.',
          payload: {
            eventType: 'input.changeText',
            fields: [{ path: 'value', type: 'string', label: 'Value' }],
          },
        },
      },
    },
    events: {
      changeText: {
        label: 'Change text',
        eventType: 'input.changeText',
        description: 'Emitted when the input value changes.',
        payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
      },
    },
    props: {
      value: {
        type: 'string',
        category: 'Content',
        label: 'Value',
      },
      disabled: {
        type: 'boolean',
        category: 'State',
        label: 'Disabled',
      },
    },
  },
  Textarea: {
    name: 'Textarea',
    category: 'component',
    description: 'Captures a multiline string value.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        value: {
          label: 'Value',
          description: 'Current textarea value.',
          value: { type: 'string' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
        disabled: {
          label: 'Disabled',
          description: 'Whether the textarea is disabled.',
          value: { type: 'boolean' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
      events: {
        changeText: {
          label: 'Change text',
          description: 'Runs when the textarea value changes.',
          payload: {
            eventType: 'textarea.changeText',
            fields: [{ path: 'value', type: 'string', label: 'Value' }],
          },
        },
      },
    },
    events: {
      changeText: {
        label: 'Change text',
        eventType: 'textarea.changeText',
        description: 'Emitted when the textarea value changes.',
        payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
      },
    },
    props: {
      value: {
        type: 'string',
        category: 'Content',
        label: 'Value',
      },
      disabled: {
        type: 'boolean',
        category: 'State',
        label: 'Disabled',
      },
    },
  },
  Select: {
    name: 'Select',
    category: 'component',
    description: 'Captures one selected string value.',
    directManifestNode: false,
    allowedChildren: [],
    bindings: {
      props: {
        value: {
          label: 'Value',
          description: 'Current selected value.',
          value: { type: 'string' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
        disabled: {
          label: 'Disabled',
          description: 'Whether the select is disabled.',
          value: { type: 'boolean' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
      events: {
        valueChange: {
          label: 'Value change',
          description: 'Runs when the selected value changes.',
          payload: {
            eventType: 'select.valueChange',
            fields: [{ path: 'value', type: 'string', label: 'Value' }],
          },
        },
      },
    },
    events: {
      valueChange: {
        label: 'Value change',
        eventType: 'select.valueChange',
        description: 'Emitted when the selected value changes.',
        payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
      },
    },
    note: 'Form control component; not represented as a manifest node in v1.',
    props: {
      value: {
        type: 'string',
        category: 'Content',
        label: 'Value',
      },
      disabled: {
        type: 'boolean',
        category: 'State',
        label: 'Disabled',
      },
    },
  },
  Checkbox: {
    name: 'Checkbox',
    category: 'component',
    description: 'Captures a boolean checked state.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        checked: {
          label: 'Checked',
          description: 'Current checked state.',
          value: { type: 'boolean' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
        disabled: {
          label: 'Disabled',
          description: 'Whether the checkbox is disabled.',
          value: { type: 'boolean' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
      events: {
        checkedChange: {
          label: 'Checked change',
          description: 'Runs when checked state changes.',
          payload: {
            eventType: 'checkbox.checkedChange',
            fields: [{ path: 'checked', type: 'boolean', label: 'Checked' }],
          },
        },
      },
    },
    events: {
      checkedChange: {
        label: 'Checked change',
        eventType: 'checkbox.checkedChange',
        description: 'Emitted when the checked state changes.',
        payloadFields: [{ path: 'checked', type: 'boolean', label: 'Checked' }],
      },
    },
    props: {
      checked: {
        type: 'boolean',
        category: 'State',
        label: 'Checked',
      },
      disabled: {
        type: 'boolean',
        category: 'State',
        label: 'Disabled',
      },
    },
  },
  SwitchField: {
    name: 'SwitchField',
    category: 'pattern',
    description: 'Captures a boolean switch value with a label.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        value: {
          label: 'Value',
          description: 'Current switch value.',
          value: { type: 'boolean' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
        disabled: {
          label: 'Disabled',
          description: 'Whether the switch is disabled.',
          value: { type: 'boolean' },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
      events: {
        valueChange: {
          label: 'Value change',
          description: 'Runs when the switch value changes.',
          payload: {
            eventType: 'switchField.valueChange',
            fields: [{ path: 'value', type: 'boolean', label: 'Value' }],
          },
        },
      },
    },
    events: {
      valueChange: {
        label: 'Value change',
        eventType: 'switchField.valueChange',
        description: 'Emitted when the switch value changes.',
        payloadFields: [{ path: 'value', type: 'boolean', label: 'Value' }],
      },
    },
    props: {
      value: {
        type: 'boolean',
        category: 'State',
        label: 'Value',
      },
      disabled: {
        type: 'boolean',
        category: 'State',
        label: 'Disabled',
      },
    },
  },
  List: {
    name: 'List',
    category: 'pattern',
    description: 'Renders a collection of list items.',
    directManifestNode: true,
    allowedChildren: ['ListSection', 'ListRow'],
    bindings: {
      props: {
        items: {
          label: 'Items',
          description: 'Collection rendered by the list.',
          value: {
            type: 'array',
            itemType: 'object',
          },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
    },
    props: {
      items: {
        type: 'array',
        category: 'Data',
        label: 'Items',
      },
    },
  },
  DataTable: {
    name: 'DataTable',
    category: 'component',
    description: 'Renders tabular records.',
    directManifestNode: true,
    allowedChildren: [],
    bindings: {
      props: {
        rows: {
          label: 'Rows',
          description: 'Rows rendered by the table.',
          value: {
            type: 'array',
            itemType: 'record',
          },
          acceptsFallback: true,
          acceptsTransforms: true,
        },
      },
    },
    props: {
      rows: {
        type: 'array',
        category: 'Data',
        label: 'Rows',
      },
    },
  },
} as const satisfies UiComponentMetaRegistry;

export type ZoraBindableComponentType = keyof typeof ZORA_BINDABLE_COMPONENT_META;
