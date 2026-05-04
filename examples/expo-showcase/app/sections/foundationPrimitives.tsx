import {
  Badge,
  Box,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Inline,
  PageSection,
  Show,
  Spacer,
  Stack,
  Surface,
  Text,
} from '@ankhorage/zora';
import React from 'react';

export function FoundationPrimitivesSection() {
  return (
    <PageSection title="Foundation primitives">
      <Card
        title="Stack and Inline"
        description="Use Stack for vertical rhythm and Inline for wrapped horizontal groups."
      >
        <Stack gap="m">
          <Stack gap="s">
            <Surface variant="subtle" p="m">
              <Text weight="semiBold">Stack item</Text>
            </Surface>
            <Surface variant="subtle" p="m">
              <Text weight="semiBold">Second stack item</Text>
            </Surface>
          </Stack>
          <Inline gap="s">
            <Badge tone="primary">Inline</Badge>
            <Badge tone="success" emphasis="soft">
              Wrapped
            </Badge>
            <Badge tone="warning" emphasis="soft">
              Metadata
            </Badge>
          </Inline>
        </Stack>
      </Card>

      <Card
        title="Grid and Container"
        description="Responsive containers and grids keep catalog surfaces aligned."
      >
        <Container maxWidth={720} px="s">
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
        </Container>
      </Card>

      <Card
        title="Center and Box"
        description="Box is the flexible primitive; Center aligns its children."
      >
        <Center minHeight={96} p="m">
          <Box p="m" radius="m" bg="surface">
            <Text weight="semiBold">Centered Box</Text>
          </Box>
        </Center>
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
        title="Divider, Spacer, and Show"
        description="Small layout utilities keep examples readable."
      >
        <Stack gap="s">
          <Text>First block</Text>
          <Divider />
          <Spacer size="s" />
          <Text>Second block after a spacer</Text>
          <Show
            when={{ base: true, md: false }}
            fallback={<Badge tone="neutral">Desktop fallback</Badge>}
          >
            <Badge tone="primary" emphasis="soft">
              Visible on base breakpoint
            </Badge>
          </Show>
        </Stack>
      </Card>
    </PageSection>
  );
}
