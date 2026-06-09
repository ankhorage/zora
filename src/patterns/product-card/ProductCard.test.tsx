/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render } from '@testing-library/react-native';
import { describe, expect, test } from 'bun:test';
import React from 'react';

import { ZORA_COMPONENT_META } from '../../metadata';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  test('is registered as a public ZORA pattern', () => {
    expect(ZORA_COMPONENT_META.ProductCard?.name).toBe('ProductCard');
    expect(ZORA_COMPONENT_META.ProductCard?.category).toBe('pattern');
    expect(ZORA_COMPONENT_META.ProductCard?.directManifestNode).toBe(true);
    expect(ZORA_COMPONENT_META.ProductCard?.allowedChildren).toEqual([]);
    expect(ZORA_COMPONENT_META.ProductCard?.requirements).toBeUndefined();
  });

  test('has correct event metadata', () => {
    expect(ZORA_COMPONENT_META.ProductCard?.events?.press).toBeDefined();
    expect(ZORA_COMPONENT_META.ProductCard?.events?.primaryAction).toBeDefined();
    expect(ZORA_COMPONENT_META.ProductCard?.events?.secondaryAction).toBeDefined();
  });

  test('renders correctly', () => {
    const wrapper = render(<ProductCard title="Test Product" />);
    expect(wrapper.getByText('Test Product')).toBeDefined();
  });

  test('renders vendor as brand fallback', () => {
    const wrapper = render(<ProductCard title="Test Product" vendor="Vendor Name" />);
    expect(wrapper.getByText('Vendor Name')).toBeDefined();
  });

  test('renders brand over vendor', () => {
    const wrapper = render(
      <ProductCard title="Test Product" brand="Brand Name" vendor="Vendor Name" />,
    );
    expect(wrapper.getByText('Brand Name')).toBeDefined();
  });
});
