import {
  BottomSheet,
  Box,
  Button,
  Card,
  ChipGroup,
  ContentRail,
  FlatList,
  SectionList,
  Stack,
  Text,
} from '@ankhorage/zora';
import React from 'react';

export function ManifestFeaturesSection() {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('all');
  return (
    <Stack gap="m">
      <Text>Free horizontal chip group</Text>
      <ContentRail itemSize="content" padding="none">
        <ChipGroup
          wrap={false}
          value={filter}
          onValueChange={setFilter}
          items={[
            { value: 'all', label: 'All content' },
            { value: 'saved', label: 'Saved for later' },
            { value: 'recent', label: 'Recently updated' },
            { value: 'recommended', label: 'Recommended' },
          ]}
        />
      </ContentRail>
      <Text>Native virtualized cards</Text>
      <Box height={180}>
        <FlatList horizontal showsScrollIndicator>
          {['First', 'Second', 'Third'].map((title) => (
            <Box key={title} width={220} p="s">
              <Card title={title} description="Virtualized manifest child" />
            </Box>
          ))}
        </FlatList>
      </Box>
      <Text>Native sections</Text>
      <Box height={220}>
        <SectionList
          sections={[
            { key: 'saved', title: 'Saved', itemCount: 2 },
            { key: 'recent', title: 'Recent', itemCount: 1 },
          ]}
        >
          <Text key="a">Saved item one</Text>
          <Text key="b">Saved item two</Text>
          <Text key="c">Recent item</Text>
        </SectionList>
      </Box>
      <Button onPress={() => setOpen(true)}>Open declarative sheet</Button>
      <BottomSheet open={open} onDismiss={() => setOpen(false)}>
        <Stack p="l" gap="m">
          <Text>Manifest-owned sheet content</Text>
          <Button onPress={() => setOpen(false)}>Close sheet</Button>
        </Stack>
      </BottomSheet>
    </Stack>
  );
}
