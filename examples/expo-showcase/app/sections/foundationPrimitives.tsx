import { Badge, Card, Divider, Grid, ScreenSection, Surface, Text, View } from '@ankhorage/zora';
import React from 'react';

export function FoundationPrimitivesSection() {
  return (
    <ScreenSection title="Foundation primitives">
      <Card
        title="View flow"
        description="Use View for vertical rhythm and responsive horizontal groups."
      >
        <View gap="m">
          <View gap="s">
            <Surface variant="subtle" p="m">
              <Text weight="semiBold">Stack item</Text>
            </Surface>
            <Surface variant="subtle" p="m">
              <Text weight="semiBold">Second stack item</Text>
            </Surface>
          </View>
          <View direction="row" gap="s">
            <Badge color="primary">Inline</Badge>
            <Badge color="success" variant="soft">
              Wrapped
            </Badge>
            <Badge color="warning" variant="soft">
              Metadata
            </Badge>
          </View>
        </View>
      </Card>

      <Card
        title="Grid and bounded View"
        description="Responsive View constraints and grids keep catalog surfaces aligned."
      >
        <View maxWidth={720} px="s">
          <Grid cols={{ base: 1, md: 3 }} gap="s">
            <Surface variant="outline" p="m">
              <Text>Grid cell A</Text>
            </Surface>
            <Surface variant="outline" p="m">
              <Text>Grid cell B</Text>
            </Surface>
            <Surface variant="outline" p="m">
              <Text>Grid cell C</Text>
            </Surface>
          </Grid>
        </View>
      </Card>

      <Card title="View alignment" description="View owns flexible geometry and alignment.">
        <View align="center" justify="center" minHeight={96} p="m">
          <View p="m" radius="m" bg="surface">
            <Text weight="semiBold">Centered View</Text>
          </View>
        </View>
      </Card>

      <Card
        title="Surface variants"
        description="Default, subtle, raised, and outline surfaces are re-exported by ZORA."
      >
        <Grid cols={{ base: 1, md: 4 }} gap="s">
          <Surface variant="default" p="m">
            <Text>Default</Text>
          </Surface>
          <Surface variant="subtle" p="m">
            <Text>Subtle</Text>
          </Surface>
          <Surface variant="raised" p="m">
            <Text>Raised</Text>
          </Surface>
          <Surface variant="outline" p="m">
            <Text>Outline</Text>
          </Surface>
        </Grid>
      </Card>

      <Card
        title="Divider and spacing"
        description="View gap and dimensions cover ordinary spacing without helper components."
      >
        <View gap="s">
          <Text>First block</Text>
          <Divider />
          <View height="s" />
          <Text>Second block after explicit spacing</Text>
        </View>
      </Card>
    </ScreenSection>
  );
}
