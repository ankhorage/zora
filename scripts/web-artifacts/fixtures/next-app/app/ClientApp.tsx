'use client';

import { useState } from 'react';

import { ZoraProvider } from '@zora/ZoraProvider';
import { AppBar } from '@zora/app-bar';
import { Button } from '@zora/button';
import { Select } from '@zora/select';
import { Text } from '@zora/text';

export function ClientApp() {
  const [value, setValue] = useState('grid');
  return (
    <ZoraProvider mode="light">
      <AppBar title="Next materialization" />
      <Text>Ready</Text>
      <Button>Action</Button>
      <Select
        value={value}
        onValueChange={setValue}
        options={[
          { label: 'Grid', value: 'grid' },
          { label: 'Circle', value: 'circle' },
        ]}
        testID="next-layout"
      />
    </ZoraProvider>
  );
}
