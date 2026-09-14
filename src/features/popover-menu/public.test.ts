import { expect, test } from 'bun:test';

test('PopoverMenu composes the released Surface PopoverMenu capability', async () => {
  const source = await Bun.file(
    'src/features/popover-menu/adapters/inbound/PopoverMenu.tsx',
  ).text();

  expect(source).toContain('PopoverMenu as SurfacePopoverMenu');
  expect(source).toContain('<SurfacePopoverMenu');
  expect(source).not.toContain('DropdownMenu');
});
