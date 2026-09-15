import {
  Button,
  Card,
  Checkbox,
  Form,
  FormActions,
  FormError,
  Field,
  Gradient,
  Icon,
  OAuthProviderList,
  Radio,
  RadioGroup,
  ScreenSection,
  Text,
  TextInput,
  View,
} from '@ankhorage/zora';
import React from 'react';

export function ComponentFormsSection() {
  const [standaloneChecked, setStandaloneChecked] = React.useState(false);
  const [standaloneRadioChecked, setStandaloneRadioChecked] = React.useState(true);
  const [cardChoice, setCardChoice] = React.useState<'instant' | 'reflect' | 'mixed'>('reflect');
  const [formValues, setFormValues] = React.useState<{ email: string; project: string }>({
    email: 'hello@example.com',
    project: 'Showcase refresh',
  });

  return (
    <ScreenSection title="Component coverage additions">
      <Card
        title="Standalone Checkbox and Radio"
        description="Single controls are available outside grouped inputs."
      >
        <View gap="s">
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
        </View>
      </Card>

      <Card
        title="Card radio group"
        description="The presentation changes the option surface while preserving one single-choice radio group."
      >
        <RadioGroup
          value={cardChoice}
          onValueChange={setCardChoice}
          presentation="card"
          options={[
            {
              value: 'instant',
              label: 'Act immediately',
              description: 'Choose without reflection.',
            },
            {
              value: 'reflect',
              label: 'Reflect first',
              description: 'Think before deciding.',
            },
            {
              value: 'mixed',
              label: 'Mixed approach',
              description: 'Practice both modes.',
            },
          ]}
        />
      </Card>

      <Card
        title="Portable gradient adapter"
        description="The Expo app supplies expo-linear-gradient without coupling the ZORA runtime to Expo."
      >
        <Gradient colors={['#0b6e99', '#7c3aed']} minHeight={96} p="m" radius="m">
          <Text color="neutral" weight="semiBold">
            Expo 57 gradient integration
          </Text>
        </Gradient>
      </Card>

      <Card
        title="OAuth icon styles"
        description="Exercises FontAwesome, FA5 brand, FA5 solid, and FA6 brand fonts."
      >
        <OAuthProviderList
          layout="inline"
          providers={[{ id: 'github' }, { id: 'microsoft' }, { id: 'zoom' }, { id: 'x' }]}
        />
      </Card>

      <Card
        title="Plain Icon"
        description="Icon is useful for metadata and decorative affordances."
      >
        <View direction="row" gap="m">
          <Icon name="sparkles-outline" size={18} />
          <Icon name="color-palette-outline" size={24} />
          <Icon name="rocket-outline" size={32} />
        </View>
      </Card>

      <Card
        title="Form wrapper"
        description="Compact coverage for Form, Field, FormActions, and FormError."
      >
        <View gap="m">
          <Form onSubmit={() => undefined} submitLabel="Save form">
            <FormError error="Example form-level error" />
            <Field label="Email" required>
              <TextInput
                value={formValues.email}
                onChangeText={(email) => setFormValues((values) => ({ ...values, email }))}
              />
            </Field>
            <Field label="Project name">
              <TextInput
                value={formValues.project}
                onChangeText={(project) => setFormValues((values) => ({ ...values, project }))}
              />
            </Field>
          </Form>

          <Form submitLabel="Save manual form">
            <FormError error="Standalone FormError coverage" />
            <Field label="Manual Field" helperText="Useful when a custom control is needed.">
              <TextInput placeholder="Manual field input" />
            </Field>
          </Form>

          <FormActions submitLabel="Save manually" onSubmit={() => undefined}>
            <Button variant="ghost" color="neutral">
              Cancel
            </Button>
          </FormActions>

          <Text emphasis="muted" variant="bodySmall">
            Form values: {formValues.email} / {formValues.project}
          </Text>
        </View>
      </Card>
    </ScreenSection>
  );
}
