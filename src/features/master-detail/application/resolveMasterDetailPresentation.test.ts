import { expect, test } from 'bun:test';

import { resolveMasterDetailPresentation } from './resolveMasterDetailPresentation';

test('projects host-owned compact route state below the desktop breakpoint', () => {
  expect(resolveMasterDetailPresentation('base', 'master', 'split')).toBe('master');
  expect(resolveMasterDetailPresentation('sm', 'detail', 'split')).toBe('detail');
});

test('projects a 30/70 workspace at expanded breakpoints without changing compact route state', () => {
  expect(resolveMasterDetailPresentation('md', 'detail', 'split')).toBe('split');
  expect(resolveMasterDetailPresentation('lg', 'master', 'split')).toBe('split');
});

test('permits a full-width master mode only at expanded breakpoints', () => {
  expect(resolveMasterDetailPresentation('md', 'detail', 'master')).toBe('master');
  expect(resolveMasterDetailPresentation('base', 'detail', 'master')).toBe('detail');
});
