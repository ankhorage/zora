import { expect, mock, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactNativeWeb from 'react-native-web';

await mock.module('react-native', () => ReactNativeWeb);

const { RadioGroup } = await import('./RadioGroup');
const { ZoraProvider } = await import('../../theme/ZoraProvider');

test('card presentation preserves one radio group with repeated radio semantics', () => {
  const markup = renderToStaticMarkup(
    <ZoraProvider>
      <RadioGroup
        value="reflect"
        onValueChange={() => undefined}
        presentation="card"
        options={[
          { value: 'instant', label: 'Act immediately', description: 'Choose without reflection.' },
          { value: 'reflect', label: 'Reflect first', description: 'Think before deciding.' },
          { value: 'mixed', label: 'Mixed approach', description: 'Practice both modes.' },
        ]}
      />
    </ZoraProvider>,
  );

  expect(markup.match(/role="radiogroup"/g)).toHaveLength(1);
  expect(markup.match(/role="radio"/g)).toHaveLength(3);
  expect(markup.match(/aria-checked="true"/g)).toHaveLength(1);
  expect(markup.match(/aria-checked="false"/g)).toHaveLength(2);
  expect(markup).toContain('Reflect first');
  expect(markup).toContain('Think before deciding.');
});
