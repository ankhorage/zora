import {
  Button,
  Card,
  Checkbox,
  Form,
  FormActions,
  FormError,
  FormField,
  Icon,
  Inline,
  Input,
  PageSection,
  Radio,
  Stack,
  Text,
} from '@ankhorage/zora';
import React from 'react';

export function ComponentFormsSection() {
  const [standaloneChecked, setStandaloneChecked] = React.useState(false);
  const [standaloneRadioChecked, setStandaloneRadioChecked] = React.useState(true);
  const [formValues, setFormValues] = React.useState({
    email: 'hello@example.com',
    project: 'Showcase refresh',
  });

  return (
    <PageSection title="Component coverage additions">
      <Card
        title="Standalone Checkbox and Radio"
        description="Single controls are available outside grouped inputs."
      >
        <Stack gap="s">
          <Checkbox checked={standaloneChecked} onCheckedChange={setStandaloneChecked}>
            Standalone checkbox
          </Checkbox>
          <Checkbox checked disabled>
            Disabled checked checkbox
          </Checkbox>
          <Radio checked={standaloneRadioChecked} onCheckedChange={setStandaloneRadioChecked}>
            Standalone radio
          </Radio>
          <Radio disabled>Disabled radio</Radio>
        </Stack>
      </Card>

      <Card title="Plain Icon" description="Icon is useful for metadata and decorative affordances.">
        <Inline gap="m">
          <Icon name="sparkles-outline" size={18} />
          <Icon name="color-palette-outline" size={24} />
          <Icon name="rocket-outline" size={32} />
        </Inline>
      </Card>

      <Card title="Form wrapper" description="Compact coverage for Form, FormField, FormActions, and FormError.">
        <Stack gap="m">
          <Form
            fields={[
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'hello@example.com',
                rules: [{ kind: 'required' }, { kind: 'email' }],
              },
              {
                name: 'project',
                label: 'Project name',
                placeholder: 'Showcase refresh',
              },
            ]}
            values={formValues}
            onChange={setFormValues}
            onSubmit={() => undefined}
            error="Example form-level error"
            submitLabel="Save form"
          />

          <FormField label="Manual FormField" helperText="Useful when a custom control is needed.">
            <Input placeholder="Manual field input" />
          </FormField>

          <FormError error="Standalone FormError coverage" />

          <FormActions submitLabel="Save manually" onSubmit={() => undefined}>
            <Button emphasis="ghost" tone="neutral">
              Cancel
            </Button>
          </FormActions>

          <Text tone="muted" variant="bodySmall">
            Form values: {formValues.email} / {formValues.project}
          </Text>
        </Stack>
      </Card>
    </PageSection>
  );
}
